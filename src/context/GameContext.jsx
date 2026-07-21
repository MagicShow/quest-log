import { createContext, useContext, useReducer, useEffect, useRef, useState } from 'react'
import { supabase } from '../utils/supabase'
import { getQuestRewards, checkLevelUp, checkAchievements, levelProgress } from '../utils/gameLogic'

const GameContext = createContext(null)

// ---- Default fresh state ----
const defaultProjects = [
  { id: 'life-admin', name: 'Life Admin', icon: '⚔️', color: '#FF2D78' },
  { id: 'home', name: 'Home', icon: '🏠', color: '#00E5FF' },
  { id: 'apps', name: 'Apps', icon: '🚀', color: '#00FF88' },
  { id: 'family', name: 'Family', icon: '👨‍👧‍👦', color: '#FFD700' },
  { id: 'self', name: 'Self', icon: '💪', color: '#FF9500' },
]

const defaultAchievements = [
  { id: 'first-blood', name: 'First Blood', description: 'Complete your first quest', icon: '⚔️', unlocked: false, unlockedAt: null },
  { id: 'hot-streak', name: 'Hot Streak', description: 'Maintain a 7-day streak', icon: '🔥', unlocked: false, unlockedAt: null },
  { id: 'epic-win', name: 'Epic Win', description: 'Complete an Epic quest', icon: '🏆', unlocked: false, unlockedAt: null },
  { id: 'decimation', name: 'Decimation', description: 'Complete 10 quests in one day', icon: '💀', unlocked: false, unlockedAt: null },
  { id: 'battle-tested', name: 'Battle Tested', description: 'Complete 100 quests total', icon: '🛡️', unlocked: false, unlockedAt: null },
  { id: 'decision-speed', name: 'Decision Speed', description: 'Complete a quest within 5 minutes of creating it', icon: '⚡', unlocked: false, unlockedAt: null },
  { id: 'level-5', name: 'Veteran', description: 'Reach level 5', icon: '🎖️', unlocked: false, unlockedAt: null },
  { id: 'level-10', name: 'Elite', description: 'Reach level 10', icon: '⭐', unlocked: false, unlockedAt: null },
  { id: 'streak-14', name: 'Two Weeks', description: 'Maintain a 14-day streak', icon: '🌟', unlocked: false, unlockedAt: null },
  { id: 'streak-30', name: 'Monthly Grind', description: 'Maintain a 30-day streak', icon: '💎', unlocked: false, unlockedAt: null },
  { id: 'all-projects', name: 'Diversified', description: 'Have quests in all 5 projects', icon: '📦', unlocked: false, unlockedAt: null },
  { id: 'energy-manager', name: 'Energy Manager', description: 'Finish a day with 50+ energy remaining', icon: '🔋', unlocked: false, unlockedAt: null },
]

const defaultState = {
  player: {
    name: 'GOATED',
    level: 1,
    xp: 0,
    energy: 100,
    maxEnergy: 100,
    streak: 0,
    lastCheckIn: null,
    gold: 0,
    achievements: [],
    createdAt: new Date().toISOString(),
  },
  quests: [],
  projects: defaultProjects,
  achievements: defaultAchievements,
  dailyStats: {},
  nightAgentTips: [],
  gameWorld: {
    currentLevel: 1,
    conanPosition: 0,
    levelComplete: false,
    gameComplete: false,
    defeatedEnemies: [],
    currentEnemy: null,
  },
  // Party state
  party: null,
  partyMembers: [],
  partyFeed: [],
  partyOwnerId: null,
}

// ---- Reducer ----
function reducer(state, action) {
  switch (action.type) {
    case 'LOAD':
      return action.state

    case 'ADD_QUEST': {
      const rewards = getQuestRewards(action.quest.difficulty)
      const newQuest = {
        id: Date.now().toString(),
        title: action.quest.title,
        difficulty: action.quest.difficulty,
        type: action.quest.type || 'important',
        project: action.quest.project,
        completed: false,
        xpReward: rewards.xp,
        energyCost: rewards.energy,
        createdAt: new Date().toISOString(),
        completedAt: null,
      }
      return { ...state, quests: [...state.quests, newQuest] }
    }

    case 'COMPLETE_QUEST': {
      const quest = state.quests.find(q => q.id === action.id)
      if (!quest || quest.completed) return state

      const updatedQuest = { ...quest, completed: true, completedAt: new Date().toISOString() }
      const newXp = state.player.xp + quest.xpReward
      const newEnergy = Math.max(0, state.player.energy - quest.energyCost)
      const today = new Date().toISOString().split('T')[0]

      return {
        ...state,
        quests: state.quests.map(q => q.id === action.id ? updatedQuest : q),
        player: { ...state.player, xp: newXp, energy: newEnergy },
        dailyStats: {
          ...state.dailyStats,
          [today]: {
            completed: (state.dailyStats[today]?.completed || 0) + 1,
            xpGained: (state.dailyStats[today]?.xpGained || 0) + quest.xpReward,
            energySpent: (state.dailyStats[today]?.energySpent || 0) + quest.energyCost,
          },
        },
      }
    }

    case 'UNCOMPLETE_QUEST': {
      const quest = state.quests.find(q => q.id === action.id)
      if (!quest || !quest.completed) return state

      const newEnergy = Math.min(state.player.maxEnergy, state.player.energy + quest.energyCost)
      const newXp = Math.max(0, state.player.xp - quest.xpReward)
      const today = new Date().toISOString().split('T')[0]

      return {
        ...state,
        quests: state.quests.map(q => q.id === action.id ? { ...q, completed: false, completedAt: null } : q),
        player: { ...state.player, xp: newXp, energy: newEnergy },
        dailyStats: {
          ...state.dailyStats,
          [today]: {
            ...state.dailyStats[today],
            completed: Math.max(0, (state.dailyStats[today]?.completed || 1) - 1),
          },
        },
      }
    }

    case 'DELETE_QUEST': {
      const quest = state.quests.find(q => q.id === action.id)
      if (!quest) return state

      let newXp = state.player.xp
      let newEnergy = state.player.energy

      if (quest.completed) {
        newXp = Math.max(0, newXp - quest.xpReward)
        newEnergy = Math.min(state.player.maxEnergy, newEnergy + quest.energyCost)
      }

      return {
        ...state,
        quests: state.quests.filter(q => q.id !== action.id),
        player: { ...state.player, xp: newXp, energy: newEnergy },
      }
    }

    case 'EDIT_QUEST': {
      const rewards = getQuestRewards(action.quest.difficulty)
      return {
        ...state,
        quests: state.quests.map(q =>
          q.id === action.id
            ? { ...q, ...action.quest, xpReward: rewards.xp, energyCost: rewards.energy }
            : q
        ),
      }
    }

    case 'UPDATE_PLAYER_NAME':
      return { ...state, player: { ...state.player, name: action.name } }

    case 'REFILL_ENERGY':
      return { ...state, player: { ...state.player, energy: state.player.maxEnergy } }

    case 'UPDATE_STREAK': {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().split('T')[0]
      const today = new Date().toISOString().split('T')[0]
      const hadActivityYesterday = state.dailyStats[yesterdayStr]?.completed > 0
      const hasActivityToday = state.dailyStats[today]?.completed > 0

      let newStreak = state.player.streak
      if (hasActivityToday) {
        if (hadActivityYesterday || state.player.streak === 0) {
          newStreak = state.player.streak + 1
        } else {
          newStreak = 1
        }
      }
      return { ...state, player: { ...state.player, streak: newStreak, lastCheckIn: today } }
    }

    case 'UNLOCK_ACHIEVEMENT':
      if (state.player.achievements.includes(action.id)) return state
      return {
        ...state,
        player: { ...state.player, achievements: [...state.player.achievements, action.id] },
        achievements: state.achievements.map(a =>
          a.id === action.id ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() } : a
        ),
      }

    case 'GAME_WORLD_UPDATE':
      return {
        ...state,
        gameWorld: { ...state.gameWorld, ...action.payload },
      }

    case 'ADD_XP': {
      const newXp = state.player.xp + action.payload
      return { ...state, player: { ...state.player, xp: newXp } }
    }

    case 'ADD_NIGHT_TIP':
      return {
        ...state,
        nightAgentTips: [
          { date: new Date().toISOString().split('T')[0], tip: action.tip },
          ...state.nightAgentTips.slice(0, 6),
        ],
      }

    case 'ADD_PROJECT':
      return {
        ...state,
        projects: [...state.projects, { id: action.project.id, name: action.project.name, icon: action.project.icon, color: action.project.color }],
      }

    case 'RESET_DAY':
      return {
        ...state,
        player: { ...state.player, energy: state.player.maxEnergy },
      }

    // ---- Party actions ----
    case 'SET_PARTY':
      return {
        ...state,
        party: action.party,
        partyMembers: action.members,
        partyOwnerId: action.ownerId,
      }

    case 'SET_PARTY_FEED':
      return { ...state, partyFeed: action.feed }

    case 'ADD_PARTY_FEED_ITEM':
      return {
        ...state,
        partyFeed: [action.item, ...state.partyFeed].slice(0, 50),
      }

    case 'SET_QUEST':
      return {
        ...state,
        quests: action.quests,
      }

    case 'CLEAR_PARTY':
      return {
        ...state,
        party: null,
        partyMembers: [],
        partyFeed: [],
        partyOwnerId: null,
      }

    default:
      return state
  }
}

// ---- Generate party code ----
function generatePartyCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

// ---- Provider ----
export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null)
  const [isLoading, setIsLoading] = useState(true)
  const prevStateRef = useRef(null)
  const [levelUpData, setLevelUpData] = useState(null)
  const realtimeRef = useRef(null)
  const userIdRef = useRef(null)

  // ---- Load game from Supabase ----
  async function loadGame(user) {
    if (!user) return

    userIdRef.current = user.id

    // Load profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    const playerData = profile ? {
      name: profile.name || 'Hero',
      level: profile.level || 1,
      xp: profile.xp || 0,
      energy: profile.energy || 100,
      maxEnergy: profile.max_energy || 100,
      streak: profile.streak || 0,
      lastCheckIn: profile.last_check_in,
      gold: profile.gold || 0,
      achievements: profile.achievements || [],
    } : { ...defaultState.player }

    // Load quests (party quests if user is in a party)
    const { data: partyMembership } = await supabase
      .from('party_members')
      .select('party_id')
      .eq('user_id', user.id)
      .maybeSingle()

    let partyId = null
    if (partyMembership) {
      const { data: partyData } = await supabase
        .from('parties')
        .select('*')
        .eq('id', partyMembership.party_id)
        .single()

      if (partyData) {
        partyId = partyData.id
        dispatch({ type: 'SET_PARTY', party: partyData, ownerId: partyData.owner_id })

        const { data: members } = await supabase
          .from('party_members')
          .select('*')
          .eq('party_id', partyId)

        const memberProfiles = await Promise.all(
          (members || []).map(async m => {
            const { data: p } = await supabase
              .from('profiles')
              .select('name')
              .eq('id', m.user_id)
              .single()
            return { ...m, name: p?.name || 'Hero' }
          })
        )
        dispatch({ type: 'SET_PARTY', party: partyData, members: memberProfiles, ownerId: partyData.owner_id })
      }
    }

    // Load quests for this party or user's own quests
    let quests = []
    if (partyId) {
      const { data: partyQuests } = await supabase
        .from('quests')
        .select('*')
        .eq('party_id', partyId)
        .order('created_at', { ascending: true })

      const { data: completions } = await supabase
        .from('quest_completions')
        .select('quest_id, user_id')
        .eq('user_id', user.id)

      const completionMap = new Map((completions || []).map(c => [c.quest_id, c]))

      quests = (partyQuests || []).map(q => ({
        id: q.id,
        title: q.title,
        difficulty: q.difficulty,
        type: q.quest_type,
        project: q.project,
        completed: completionMap.has(q.id),
        xpReward: q.xp_reward,
        energyCost: q.energy_cost,
        createdAt: q.created_at,
        completedAt: null,
      }))
    }

    // Load party feed
    let partyFeed = []
    if (partyId) {
      const { data: feed } = await supabase
        .from('party_feed')
        .select('*')
        .eq('party_id', partyId)
        .order('completed_at', { ascending: false })
        .limit(20)

      partyFeed = feed || []
    }

    // Daily stats
    const today = new Date().toISOString().split('T')[0]
    const todayStats = {}
    const { data: todayCompletions } = await supabase
      .from('quest_completions')
      .select('quest_id')
      .eq('user_id', user.id)

    if (todayCompletions) {
      const todayStart = new Date(today).getTime()
      const todayQuests = quests.filter(q =>
        q.completed &&
        completionMap.get(q.id)?.completed_at &&
        new Date(completionMap.get(q.id).completed_at).getTime() >= todayStart
      )
      todayStats[today] = {
        completed: todayQuests.length,
        xpGained: todayQuests.reduce((sum, q) => sum + q.xpReward, 0),
        energySpent: todayQuests.reduce((sum, q) => sum + q.energyCost, 0),
      }
    }

    const loadedState = {
      ...defaultState,
      ...(profile ? { player: playerData } : {}),
      quests,
      partyFeed,
      dailyStats: todayStats,
    }

    dispatch({ type: 'LOAD', state: loadedState })
    prevStateRef.current = loadedState
    setIsLoading(false)
  }

  // ---- Save profile to Supabase ----
  async function saveProfile(player) {
    if (!userIdRef.current) return
    const { level } = levelProgress(player.xp)
    await supabase.from('profiles').upsert({
      id: userIdRef.current,
      name: player.name,
      level,
      xp: player.xp,
      energy: player.energy,
      max_energy: player.maxEnergy,
      streak: player.streak,
      last_check_in: player.lastCheckIn,
      gold: player.gold,
      achievements: player.achievements,
    }, { onConflict: 'id' })
  }

  // ---- Subscribe to real-time ----
  async function subscribeToParty(partyId) {
    if (!partyId || realtimeRef.current) return

    const channel = supabase
      .channel(`party-${partyId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'party_feed',
        filter: `party_id=eq.${partyId}`,
      }, async (payload) => {
        dispatch({ type: 'ADD_PARTY_FEED_ITEM', item: payload.new })
      })
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'quests',
        filter: `party_id=eq.${partyId}`,
      }, async (payload) => {
        // Reload quests
        const { data: quests } = await supabase.from('quests').select('*').eq('party_id', partyId)
        dispatch({ type: 'SET_QUEST', quests: quests || [] })
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'party_members',
        filter: `party_id=eq.${partyId}`,
      }, async () => {
        // Reload members
        const { data: members } = await supabase.from('party_members').select('*').eq('party_id', partyId)
        const memberProfiles = await Promise.all(
          (members || []).map(async m => {
            const { data: p } = await supabase.from('profiles').select('name').eq('id', m.user_id).single()
            return { ...m, name: p?.name || 'Hero' }
          })
        )
        dispatch({ type: 'SET_PARTY', party: state?.party, members: memberProfiles, ownerId: state?.partyOwnerId })
      })
      .subscribe()

    realtimeRef.current = channel
  }

  function unsubscribeFromParty() {
    if (realtimeRef.current) {
      supabase.removeChannel(realtimeRef.current)
      realtimeRef.current = null
    }
  }

  // ---- Effect: load game when user changes ----
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        loadGame(data.session.user)
      } else {
        // No user — load local default
        dispatch({ type: 'LOAD', state: defaultState })
        setIsLoading(false)
      }
    })
  }, [])

  // ---- Effect: subscribe to party realtime when party loads ----
  useEffect(() => {
    if (state?.party?.id) {
      subscribeToParty(state.party.id)
    } else {
      unsubscribeFromParty()
    }
    return () => unsubscribeFromParty()
  }, [state?.party?.id])

  // ---- Effect: save to Supabase when state changes ----
  useEffect(() => {
    if (state && !isLoading) {
      saveProfile(state.player)
    }
  }, [state?.player, isLoading])

  // ---- Effect: check level up & achievements ----
  useEffect(() => {
    if (!state || !prevStateRef.current || isLoading) return
    const prev = prevStateRef.current

    const newXp = state.player.xp
    const oldXp = prev.player.xp
    const levelUp = checkLevelUp(oldXp, newXp)
    if (levelUp) {
      const progress = levelProgress(newXp)
      setLevelUpData({ level: progress.level, xp: newXp })
    }

    const newAchievements = checkAchievements(state, prev)
    newAchievements.forEach(id => {
      dispatch({ type: 'UNLOCK_ACHIEVEMENT', id })
    })

    prevStateRef.current = state
  }, [state])

  // ---- Enhanced dispatch ----
  const enhancedDispatch = async (action) => {
    dispatch(action)

    // Sync external actions with Supabase
    if (!userIdRef.current) return

    if (action.type === 'ADD_QUEST') {
      if (state?.party?.id) {
        const rewards = getQuestRewards(action.quest.difficulty)
        const { data: quest } = await supabase.from('quests').insert({
          party_id: state.party.id,
          creator_id: userIdRef.current,
          title: action.quest.title,
          difficulty: action.quest.difficulty,
          quest_type: action.quest.type || 'important',
          project: action.quest.project,
          xp_reward: rewards.xp,
          energy_cost: rewards.energy,
        }).select().single()
        if (quest) {
          dispatch({ type: 'SET_QUEST', quests: [...state.quests, { ...quest, completed: false, completedAt: null }] })
        }
      }
    }

    if (action.type === 'COMPLETE_QUEST') {
      if (state?.party?.id) {
        const quest = state.quests.find(q => q.id === action.id)
        if (quest) {
          await supabase.from('quest_completions').insert({
            quest_id: action.id,
            user_id: userIdRef.current,
          })
          await supabase.from('party_feed').insert({
            party_id: state.party.id,
            user_id: userIdRef.current,
            user_name: state.player.name,
            quest_title: quest.title,
          })
        }
      }
    }

    if (action.type === 'DELETE_QUEST') {
      if (state?.party?.id) {
        await supabase.from('quests').delete().eq('id', action.id)
      }
    }

    if (action.type === 'UPDATE_PLAYER_NAME') {
      // Already saved via saveProfile effect
    }
  }

  // ---- Party actions ----
  async function createParty() {
    if (!userIdRef.current) throw new Error('Not authenticated')
    const code = generatePartyCode()
    const { data: party } = await supabase.from('parties').insert({
      code,
      name: `${state.player.name}'s Party`,
      owner_id: userIdRef.current,
    }).select().single()

    if (party) {
      await supabase.from('party_members').insert({
        party_id: party.id,
        user_id: userIdRef.current,
        role: 'owner',
      })

      const memberProfile = { ...(await supabase.from('profiles').select('name').eq('id', userIdRef.current).single())?.data, id: userIdRef.current }
      dispatch({ type: 'SET_PARTY', party, members: [{ ...memberProfile, role: 'owner', user_id: userIdRef.current }], ownerId: userIdRef.current })
    }
  }

  async function joinParty(code) {
    if (!userIdRef.current) throw new Error('Not authenticated')
    const { data: party } = await supabase
      .from('parties')
      .select('*')
      .eq('code', code.toUpperCase())
      .single()

    if (!party) throw new Error('Party not found')

    await supabase.from('party_members').insert({
      party_id: party.id,
      user_id: userIdRef.current,
      role: 'member',
    })

    // Load quests and members
    const { data: quests } = await supabase.from('quests').select('*').eq('party_id', party.id)
    const { data: members } = await supabase.from('party_members').select('*').eq('party_id', party.id)
    const memberProfiles = await Promise.all(
      (members || []).map(async m => {
        const { data: p } = await supabase.from('profiles').select('name').eq('id', m.user_id).single()
        return { ...m, name: p?.name || 'Hero' }
      })
    )

    dispatch({ type: 'SET_PARTY', party, members: memberProfiles, ownerId: party.owner_id })
    dispatch({ type: 'SET_QUEST', quests: quests || [] })

    // Load party feed
    const { data: feed } = await supabase.from('party_feed').select('*').eq('party_id', party.id).order('completed_at', { ascending: false }).limit(20)
    dispatch({ type: 'SET_PARTY_FEED', feed: feed || [] })
  }

  async function leaveParty() {
    if (!userIdRef.current || !state?.party) return
    const isOwner = state.party.owner_id === userIdRef.current
    const isOnlyMember = state.partyMembers.length === 1

    await supabase.from('party_members').delete()
      .eq('user_id', userIdRef.current)
      .eq('party_id', state.party.id)

    if (isOwner && isOnlyMember) {
      await supabase.from('parties').delete().eq('id', state.party.id)
    }

    unsubscribeFromParty()
    dispatch({ type: 'CLEAR_PARTY' })
  }

  // Wrapped dispatch that handles async party logic
  const wrappedDispatch = async (action) => {
    if (action.type === 'CREATE_PARTY') {
      await createParty()
      return
    }
    if (action.type === 'JOIN_PARTY') {
      await joinParty(action.code)
      return
    }
    if (action.type === 'LEAVE_PARTY') {
      await leaveParty()
      return
    }
    return enhancedDispatch(action)
  }

  if (!state) return null

  return (
    <GameContext.Provider value={{ state, dispatch: wrappedDispatch, levelUpData, setLevelUpData, isLoading }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used within GameProvider')
  return ctx
}
