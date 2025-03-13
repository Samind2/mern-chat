import React from "react";
import { useAuthStore } from "../store/useAuthStore";

const Home = () => {
  const { onLineUser } = useAuthStore();

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h2 className="text-xl mb-2"> User Online Now! </h2>
    <h2 className="text-xl mb-2"> {onLineUser.length}</h2>
    {/* {onLineUser && onLineUser.length > 0 ? (
      <ul className="list-disc">
        {onLineUser.map((userId) => (
          <li key={userId} className="text-lg">{userId}</li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-500">No users online</p>
    )} */}
  </div>
);
};

export default Home;

