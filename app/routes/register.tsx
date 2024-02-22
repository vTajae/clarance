import { useState } from "react";

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form
      action="/register"
      method="post"
      className="max-w-lg mx-auto mt-10 p-8 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg shadow-2xl"
    >
      <div className="mb-4">
        <label
          className="block text-gray-300 text-base font-semibold mb-2"
          htmlFor="username"
        >
          Email
        </label>
        <input
          className="shadow appearance-none border-2 border-gray-700 rounded-lg w-full py-3 px-4 text-white bg-gray-800 leading-tight focus:outline-none focus:border-blue-500"
          id="username"
          type="text"
          name="username"
          value={username}
          placeholder="Enter your email"
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label
          className="block text-gray-300 text-base font-semibold mb-2"
          htmlFor="password"
        >
          Password
        </label>
        <input
          className="shadow appearance-none border-2 border-gray-700 rounded-lg w-full py-3 px-4 text-white bg-gray-800 leading-tight focus:outline-none focus:border-blue-500"
          id="password"
          type="password"
          name="password"
          value={password}
          placeholder="Enter your password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-2 px-6 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
      >
        Register
      </button>
      {/* {error && <div className="text-red-500 text-xs italic">{error}</div>} */}
    </form>
  );
};

export default Register;
