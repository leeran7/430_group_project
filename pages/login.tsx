import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { login, register, useUser, addUser } from "../components/firebase";
import { User } from "../types";

const Login: NextPage = () => {
  const [user] = useUser();
  const { push } = useRouter();
  const [gettingStarted, setGettingStarted] = useState(false);
  if (user && !gettingStarted) {
    push("/");
  }
  return (
    <div>
      {user && gettingStarted ? (
        <GetStarted />
      ) : !user ? (
        <LoginForm setGettingStarted={setGettingStarted} />
      ) : null}
    </div>
  );
};

const LoginForm: React.FC<{ setGettingStarted: (v: boolean) => void }> = ({
  setGettingStarted,
}) => {
  const { push } = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const onSubmit = async () => {
    try {
      if (isRegister) {
        if (password !== confirmPassword) {
          alert("Passwords do not match");
          setError("Passwords do not match");
          return;
        }
        await register(email, password);
        setGettingStarted(true);
      } else {
        await login(email, password);
        push("/");
      }
    } catch (err: any) {
      if (isRegister && password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }
      err.code === "auth/user-not-found"
        ? (setError("No account found with that email, Please register."),
          setIsRegister(true))
        : setError("Incorrect password");

      return false;
    }
  };
  return (
    <div className="flex min-h-screen">
      <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
              {isRegister ? "Create an account" : "Sign in to your account"}
            </h2>
          </div>

          <div className="mt-8">
            <div className="mt-6">
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  return await onSubmit();
                }}
                className="space-y-6"
              >
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      required
                      className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      required
                      className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                {isRegister && (
                  <div className="space-y-1">
                    <label
                      htmlFor="confirm-password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Confirm Password
                    </label>
                    <div className="mt-1">
                      <input
                        id="confirm-password"
                        name="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        autoComplete="current-password"
                        required
                        className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                )}
                <p className="text-xs text-red-500">{error}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <a
                      href="#"
                      className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Forgot your password?
                    </a>
                  </div>
                </div>
                <div className="text-sm">
                  <button
                    type="button"
                    onClick={() => setIsRegister(!isRegister)}
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    {isRegister
                      ? "Already have an account? Login here."
                      : "Don't have an account? Register Here"}
                  </button>
                </div>

                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    {isRegister ? "Register" : "Login"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="relative hidden w-0 flex-1 lg:block">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2371&q=80"
          alt=""
        />
      </div>
    </div>
  );
};

const GetStarted: React.FC = () => {
  const [user] = useUser();
  const { push } = useRouter();
  const [newUser, setNewUser] = useState<User>({
    uid: user?.uid ?? "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipcode: 10001,
    country: "United States",
    emailAddress: user?.email ?? "",
    cart: [],
    owned: [],
    wishlist: [],
  });

  const setField = (field: keyof User, value: string | number) => {
    setNewUser({ ...newUser, [field]: value });
  };

  useEffect(() => {
    if (!user) {
      push("/login");
    }
  }, [user, push]);

  if (!user) return null;
  const onSubmit = async () => {
    const v = Object.values(newUser).filter((u) => u === "");
    if (v.length > 0) {
      alert("Please submit all fields");
      return;
    }
    await addUser(newUser);
    push("/");
    try {
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen justify-center items-center md:grid md:grid-cols-5 md:gap-6 mx-10 sm:mx-20 lg:mx-64">
      <div className="mt-5 md:col-span-5 md:mt-0">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            return await onSubmit();
          }}
        >
          <div className="px-4 mb-2 sm:px-0">
            <h2 className="text-2xl font-semibold leading-6 text-gray-900">
              Personal Information
            </h2>
          </div>
          <div className="overflow-hidden shadow sm:rounded-md">
            <div className="bg-white px-4 py-5 sm:p-6">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="first-name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    First name
                  </label>
                  <input
                    type="text"
                    name="first-name"
                    id="first-name"
                    defaultValue={newUser.firstName}
                    onChange={(e) => setField("firstName", e.target.value)}
                    autoComplete="given-name"
                    className={inputStyles}
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="last-name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Last name
                  </label>
                  <input
                    type="text"
                    name="last-name"
                    id="last-name"
                    defaultValue={newUser.lastName}
                    onChange={(e) => setField("lastName", e.target.value)}
                    autoComplete="family-name"
                    className={inputStyles}
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Country
                  </label>
                  <select
                    id="country"
                    name="country"
                    autoComplete="country-name"
                    defaultValue={newUser.country}
                    onChange={(e) => setField("country", e.target.value)}
                    className={inputStyles}
                  >
                    <option>United States</option>
                    <option>Canada</option>
                    <option>Mexico</option>
                  </select>
                </div>

                <div className="col-span-6">
                  <label
                    htmlFor="street-address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Street address
                  </label>
                  <input
                    type="text"
                    name="street-address"
                    id="street-address"
                    defaultValue={newUser.address}
                    onChange={(e) => setField("address", e.target.value)}
                    autoComplete="street-address"
                    className={inputStyles}
                  />
                </div>

                <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700"
                  >
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    id="city"
                    defaultValue={newUser.city}
                    onChange={(e) => setField("city", e.target.value)}
                    autoComplete="address-level2"
                    className={inputStyles}
                  />
                </div>

                <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                  <label
                    htmlFor="region"
                    className="block text-sm font-medium text-gray-700"
                  >
                    State / Province
                  </label>
                  <input
                    type="text"
                    name="region"
                    id="region"
                    defaultValue={newUser.state}
                    onChange={(e) => setField("state", e.target.value)}
                    autoComplete="address-level1"
                    className={inputStyles}
                  />
                </div>

                <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                  <label
                    htmlFor="postal-code"
                    className="block text-sm font-medium text-gray-700"
                  >
                    ZIP / Postal code
                  </label>
                  <input
                    type="number"
                    name="postal-code"
                    id="postal-code"
                    defaultValue={newUser.zipcode}
                    onChange={(e) =>
                      setField("zipcode", Number(e.target.value))
                    }
                    autoComplete="postal-code"
                    className={inputStyles}
                  />
                </div>
              </div>
            </div>
            <div className="px-4 py-3 sm:px-6">
              <button
                type="submit"
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Complete Registration
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const inputStyles =
  "mt-1 block w-full p-3 rounded-md bg-gray-100 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm";

export default Login;
