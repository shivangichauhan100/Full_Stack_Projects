import React, { useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Manager = () => {
  const iconRef = useRef();
  const passwordRef = useRef();
  const [form, setform] = useState({ site: "", username: "", password: "" });
  const [showPass, setShowPass] = useState(false);

  const togglePassword = () => {
    setShowPass(!showPass);
    if (passwordRef.current) {
      passwordRef.current.type = showPass ? "password" : "text";
    }
  };

  const copyText = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const [passwords, setPasswords] = useState(() => {
    const saved = localStorage.getItem("passwords");
    return saved ? JSON.parse(saved) : [];
  });

  const savePassword = () => {
    const { site, username, password } = form;
    if (!site || !username || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    const newPassword = {
      ...form,
      id: Date.now() + Math.random(), // Unique ID
    };

    const newPasswords = [...passwords, newPassword];
    localStorage.setItem("passwords", JSON.stringify(newPasswords));
    setPasswords(newPasswords);
    toast.success("Password saved successfully!");
    setform({ site: "", username: "", password: "" });
  };

  const deletePassword = (id) => {
    let c = confirm("Do you really want to delete this password?");
    if (c) {
      const newPasswords = passwords.filter((item) => item.id !== id);
      setPasswords(newPasswords);
      localStorage.setItem("passwords", JSON.stringify(newPasswords));
      toast("Password Deleted!", { theme: "dark" });
    }
  };

  const editPassword = (id) => {
    const selected = passwords.find((item) => item.id === id);
    setform({
      site: selected.site,
      username: selected.username,
      password: selected.password,
    });
    deletePassword(id);
  };

  const handleChange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} theme="light" />

      <div className="relative w-full">
        {/* Background */}
        <div className="absolute inset-0 -z-10 bg-green-50 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-fuchsia-400 opacity-20 blur-[100px]" />
        </div>

        {/* Header */}
        <div className=" p-2 md:p-0 mycontainer flex flex-col items-center justify-center text-center py-8">
          <h1 className="text-4xl font-bold text-center">
            <span className="text-green-700">&lt;</span>
            <span>Pass</span>
            <span className="text-green-700">OP/&gt;</span>
          </h1>
          <p className="text-lg text-green-700">Your own Password Manager</p>

          {/* Form */}
          <div className="text-black w-full max-w-4xl px-1 flex flex-col gap-6 mt-8">
            <input
              name="site"
              value={form.site}
              onChange={handleChange}
              type="text"
              placeholder="Enter Your Website URL"
              className="rounded-full border border-green-500 w-full p-4"
            />

            <div className="flex gap-4">
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                type="text"
                placeholder="Enter Your Username"
                className="rounded-full border border-green-500 flex-1 p-4"
              />
              <div className="relative flex-1">
                <input
                  ref={passwordRef}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  type="password"
                  placeholder="Enter Your Password"
                  className="rounded-full border border-green-500 w-full p-4 pr-20"
                />
                <span
                  className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-sm text-green-600 cursor-pointer"
                  onClick={togglePassword}
                >
                  {showPass ? "hide" : "show"}
                  <lord-icon
                    ref={iconRef}
                    src="https://cdn.lordicon.com/dxjqoygy.json"
                    trigger="hover"
                    colors="primary:#121331,secondary:#109121"
                    style={{ width: "20px", height: "20px" }}
                  ></lord-icon>
                </span>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={savePassword}
                className="flex items-center gap-2 bg-green-600 text-black rounded-full px-8 py-3 hover:bg-green-500 transition border-2 border-green-900"
              >
                <lord-icon
                  src="https://cdn.lordicon.com/fqbvgezn.json"
                  trigger="hover"
                  colors="primary:#121331,secondary:#242424"
                  style={{ width: "24px", height: "24px" }}
                />
                Save Password
              </button>
            </div>

            {/* Password List */}
            <div className="passwords">
              <h2 className="font-bold text-2xl py-4">Your Passwords</h2>
              {passwords.length === 0 && <div>No passwords to show</div>}
              <table className="table-auto w-full rounded-md overflow-hidden">
                <thead className="bg-green-800 text-white">
                  <tr>
                    <th className="py-2">Site</th>
                    <th className="py-2">Username</th>
                    <th className="py-2">Password</th>
                    <th className="py-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-green-100">
                  {passwords.map((item) => (
                    <tr key={item.id}>
                      <td className="py-2 text-center">
                        <div className="flex justify-center items-center gap-2">
                          <a
                            href={item.site}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-700 underline"
                          >
                            {item.site}
                          </a>
                          <img
                            src="https://icon-library.com/images/copy-icon/copy-icon-17.jpg"
                            alt="copy"
                            className="w-4 h-4 cursor-pointer"
                            onClick={() => copyText(item.site, "Site")}
                          />
                        </div>
                      </td>
                      <td className="py-2 text-center">
                        <div className="flex justify-center items-center gap-2">
                          {item.username}
                          <img
                            src="https://icon-library.com/images/copy-icon/copy-icon-17.jpg"
                            alt="copy"
                            className="w-4 h-4 cursor-pointer"
                            onClick={() => copyText(item.username, "Username")}
                          />
                        </div>
                      </td>
                      <td className="py-2 text-center">
                        <div className="flex justify-center items-center gap-2">
                          {item.password}
                          <img
                            src="https://icon-library.com/images/copy-icon/copy-icon-17.jpg"
                            alt="copy"
                            className="w-4 h-4 cursor-pointer"
                            onClick={() => copyText(item.password, "Password")}
                          />
                        </div>
                      </td>
                      <td className="py-2 text-center">
                        <div className="flex justify-center items-center gap-2">
                          <span
                            onClick={() => editPassword(item.id)}
                            className="cursor-pointer"
                          >
                            <lord-icon
                              src="https://cdn.lordicon.com/gwlusjdu.json"
                              trigger="hover"
                              style={{ width: "25px", height: "25px" }}
                            ></lord-icon>
                          </span>
                          <span
                            onClick={() => deletePassword(item.id)}
                            className="cursor-pointer"
                          >
                            <lord-icon
                              src="https://cdn.lordicon.com/skkahier.json"
                              trigger="hover"
                              style={{ width: "25px", height: "25px" }}
                            ></lord-icon>
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Manager;
