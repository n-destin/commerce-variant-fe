import { useEffect, useState } from "react";
import { getAllUsers, banUser, unbanUser } from "../../apis/allUsers";
import { IUser } from "../../types";

export default function DashUsers() {
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = (await getAllUsers());
        if (!Array.isArray(users)) {
          throw new Error("Data received from API is not an array");
        }
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleToggleBan = async (userId: string, isBanned: boolean) => {
    try {
      console.log(isBanned);
      
      const updatedUser = isBanned ? await unbanUser(userId) : await banUser(userId);
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user._id === userId ? updatedUser : user)),
      );
    } catch (error) {
      console.error(`Failed to ${isBanned ? "unban" : "ban"} user:`, error);
    }
  };

  useEffect(() => {
    const fetchUpdatedUsers = async () => {
      try {
        const data = await getAllUsers();
        if (!Array.isArray(data)) {
          throw new Error("Data received from API is not an array");
        }
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch updated users:", error);
      }
    };

    fetchUpdatedUsers();
  }, [users]);

  return (
    <div className='px-4 sm:px-6 lg:px-8'>
      <div className='sm:flex sm:items-center'>
        <div className='sm:flex-auto'>
          <p className='mt-2 text-sm text-gray-700'>
            A list of all the users on your platform including their name, college,
            email and role.
          </p>
        </div>
      </div>
      <div className='mt-8 flow-root'>
        <div>
          <div className='inline-block min-w-full py-2 align-middle'>
            <table className='min-w-full divide-y divide-gray-300'>
              <thead>
                <tr>
                  <th
                    scope='col'
                    className='py-3.5 pl-2 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-4'
                  >
                    Name
                  </th>
                  <th
                    scope='col'
                    className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
                  >
                    Email
                  </th>
                  <th
                    scope='col'
                    className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
                  >
                    Status
                  </th>
                  <th
                    scope='col'
                    className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
                  >
                    Role
                  </th>
                  <th scope='col' className='relative py-3.5 pl-3 '>
                    <span>Action</span>
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200 bg-white '>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className={user.isBanned ? "bg-red-100" : "bg-white "}
                  >
                    <td className='whitespace-nowrap  text-sm pl-2 md:pl-4'>
                      <div className='flex items-center'>
                        <div className='h-11 w-11 flex-shrink-0'>
                          <img
                            className='h-11 w-11 rounded-full'
                            src={user?.photos?.[0]?.value}
                            alt=''
                          />
                        </div>
                        <div className='ml-4'>
                          <div className='font-medium text-gray-900'>
                            {user.displayName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
                      <div className='mt-1 text-gray-500'>{user.email}</div>
                    </td>
                    <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
                      <span className='inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20'>
                        {user.isBanned ? "Banned" : "Active"}
                      </span>
                    </td>
                    <td className='whitespace-nowrap px-3 py-5 text-sm text-gray-500'>
                      <span className='inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20'>
                        {user.isAdmin ? "Admin" : "Member"}
                      </span>
                    </td>
                    <td className='relative whitespace-nowrap py-3.5 pl-3 pr-4 text-center text-md font-medium sm:pr-0'>
                      <a
                        href='#'
                        onClick={() => handleToggleBan(user.id, user.isBanned ? user.isBanned : false)}
                        className={`text-action-color-500 border rounded-full border-r-2 py-1 px-4 hover:text-indigo-900 ${
                          user.isBanned ? "border-red-500" : "border-green-500"
                        }`}
                      >
                        {user.isBanned ? "Unban" : "Ban"}
                        <span className='sr-only'>, {user.displayName}</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
