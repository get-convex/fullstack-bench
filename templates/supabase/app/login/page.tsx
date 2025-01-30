import { login, signup } from './actions'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#151517]">
      <div className="w-[400px] p-8 rounded-lg border border-[#26262b] bg-[#1D1D1F]">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-medium text-white mb-2">Welcome to Chat</h1>
          <p className="text-sm text-[#A1A1A3]">Sign in or create an account</p>
        </div>

        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#E1E1E3] mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-3 py-2 rounded bg-[#26262b] text-white placeholder-[#A1A1A3] border border-[#363639] focus:border-[#8D2676] focus:outline-none text-sm"
              placeholder="Enter your email"
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#E1E1E3] mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-3 py-2 rounded bg-[#26262b] text-white placeholder-[#A1A1A3] border border-[#363639] focus:border-[#8D2676] focus:outline-none text-sm"
              placeholder="Enter your password"
            />
          </div>

          <button
            formAction={login}
            className="w-full bg-[#8D2676] hover:bg-[#7A2065] text-white rounded py-2 text-sm font-medium transition-colors"
          >
            Log in
          </button>

          <button
            formAction={signup}
            className="w-full bg-transparent hover:bg-[#26262b] text-[#E1E1E3] border border-[#363639] rounded py-2 text-sm font-medium transition-colors"
          >
            Sign up
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-[#26262b]">
          <p className="text-xs text-[#A1A1A3] text-center">
            Enter your credentials to access the chat application.
          </p>
        </div>
      </div>
    </div>
  )
}