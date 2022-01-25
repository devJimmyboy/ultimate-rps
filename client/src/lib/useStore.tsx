import create from "zustand"

interface Store {
  user: UserData
  updateUsername: (name: string) => void
  updateId: (uid: string) => void
  logOut: () => void
  updateUser: (user: UserData) => void
}

export const useStore = create<Store>((set) => ({
  user: {
    name: "",
    uid: "",
  },
  updateUsername: (name) => set((state) => ({ user: { uid: state.user.uid, name } })),
  updateId: (id) => set((state) => ({ user: { uid: id, name: state.user.name } })),
  updateUser: (user) => set((state) => ({ user })),
  logOut: async () => {
    let newAnonUser = set((state) => ({ user: { uid: "", name: "" } }))
  },
}))
