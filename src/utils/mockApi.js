const LSK = 'ewms_mock_db_v1'
const sleep = (ms)=>new Promise(r=>setTimeout(r, ms))

function seedIfEmpty(){
  const db = JSON.parse(localStorage.getItem(LSK) || 'null')
  if (db) return db
  const seeded = {
    users: [
      { id: 'u1', name: 'Alice Admin', email: 'admin@acme.com', role: 'Admin', lastActive: Date.now(), status: 'Active', password: '1234' },
      { id: 'u2', name: 'Mark Manager', email: 'manager@acme.com', role: 'Manager', lastActive: Date.now(), status: 'Active', password: '1234' },
      { id: 'u3', name: 'Eve Employee', email: 'dev@acme.com', role: 'Employee', lastActive: Date.now(), status: 'Active', password: '1234' }
    ],
    session: null,
    projects: [
      { id: 1, name: 'Apollo', description: 'Payment revamp and reconciler', ownerId: 'u2', ownerName: 'Mark Manager', status: 'Active' },
      { id: 2, name: 'Hermes', description: 'Notification service', ownerId: 'u2', ownerName: 'Mark Manager', status: 'Active' }
    ],
    tasks: [
      { id: 't1', projectId: 1, title: 'Implement auth', type: 'Feature', priority: 'High', status: 'Backlog' },
      { id: 't2', projectId: 1, title: 'Fix login bug', type: 'Bug', priority: 'High', status: 'In Progress' },
      { id: 't3', projectId: 2, title: 'Add charts', type: 'Improvement', priority: 'Low', status: 'Review' },
      { id: 't4', projectId: 2, title: 'Socket keepalive', type: 'Feature', priority: 'Medium', status: 'Done' }
    ]
  }
  localStorage.setItem(LSK, JSON.stringify(seeded))
  return seeded
}

function read(){ return seedIfEmpty() }
function write(db){ localStorage.setItem(LSK, JSON.stringify(db)) }

export const api = {
  async login({ email, password }){
    await sleep(600)
    const db = read()
    const user = db.users.find(u=>u.email===email)
    if (!user || user.password !== password) throw new Error('Invalid credentials')
    db.session = { token: 'demo-jwt-token', userId: user.id }
    write(db)
    return { token: db.session.token, user }
  },

  async signup({ name, email, password, role }){   
    await sleep(800)
    const db = read()
    const existing = db.users.find(u=>u.email === email)
    if (existing) throw new Error('Email already in use')

    const newUser = {
      id: 'u' + (db.users.length + 1),
      name,
      email,
      password,
      role: role || 'Employee',   
      lastActive: Date.now(),
      status: 'Active'
    }
    db.users.push(newUser)
    db.session = { token: 'demo-jwt-token', userId: newUser.id }
    write(db)

    return { token: db.session.token, user: newUser }
  },

  async getSession(){
    await sleep(200)
    const db = read()
    if (!db.session) return null
    const user = db.users.find(u=>u.id===db.session.userId)
    return { token: db.session.token, user }
  },

  logout(){
    const db = read(); db.session = null; write(db)
  },

  async updateProfile({ name }){
    await sleep(300)
    const db = read()
    if (!db.session) throw new Error('Not authenticated')
    const user = db.users.find(u=>u.id===db.session.userId)
    user.name = name
    write(db)
    return { name }
  },

  async changePassword({ current, next }){
    await sleep(300)
    const db = read()
    if (!db.session) throw new Error('Not authenticated')
    const user = db.users.find(u=>u.id===db.session.userId)
    if (user.password !== current) throw new Error('Current password incorrect')
    user.password = next
    write(db)
    return true
  },

  async getProjects(){ await sleep(200); return read().projects },

  async createProject({ name, description }){
    await sleep(300)
    const db = read()
    const id = Math.max(0, ...db.projects.map(p=>p.id)) + 1
    const ownerId = db.session?.userId || 'u2'
    const ownerName = db.users.find(u=>u.id===ownerId)?.name || 'Unknown'
    const proj = { id, name, description, ownerId, ownerName, status: 'Active' }
    db.projects.push(proj); write(db); return proj
  },

  async getTasks(){ await sleep(200); return read().tasks },

  async getUsers(){ await sleep(200); return read().users }
}
