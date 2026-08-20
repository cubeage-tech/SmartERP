import React, { useState } from "react";

const Users = () => {
  const [search, setSearch] = useState("");

  const users = [
    {
      initials: "AM",
      name: "Arjun Mehta",
      email: "arjun@acme.com",
      role: "Super Admin",
      branch: "HQ — Mumbai",
      lastLogin: "Today, 9:14 AM",
      status: "ACTIVE",
    },
    {
      initials: "PN",
      name: "Priya Nair",
      email: "priya@acme.com",
      role: "Admin",
      branch: "HQ — Mumbai",
      lastLogin: "Today, 8:42 AM",
      status: "ACTIVE",
    },
    {
      initials: "RS",
      name: "Rahul Sharma",
      email: "rahul@acme.com",
      role: "Finance Manager",
      branch: "HQ — Mumbai",
      lastLogin: "Today, 10:02 AM",
      status: "ACTIVE",
    },
    {
      initials: "AS",
      name: "Ananya Singh",
      email: "ananya@acme.com",
      role: "Sales Manager",
      branch: "West — Pune",
      lastLogin: "Yesterday, 6:30 PM",
      status: "ACTIVE",
    },
    {
      initials: "DR",
      name: "Deepika Rao",
      email: "deepika@acme.com",
      role: "HR Manager",
      branch: "HQ — Mumbai",
      lastLogin: "Today, 9:58 AM",
      status: "ACTIVE",
    },
    {
      initials: "VJ",
      name: "Vikram Joshi",
      email: "vikram@acme.com",
      role: "Operations Manager",
      branch: "Factory — Pune",
      lastLogin: "Today, 7:45 AM",
      status: "ACTIVE",
    },
    {
      initials: "AK",
      name: "Aditya Kumar",
      email: "aditya@acme.com",
      role: "Employee",
      branch: "HQ — Mumbai",
      lastLogin: "2 days ago",
      status: "ACTIVE",
    },
    {
      initials: "SG",
      name: "Smita Gupta",
      email: "smita@acme.com",
      role: "Employee",
      branch: "West — Pune",
      lastLogin: "Today, 8:15 AM",
      status: "INACTIVE",
    },
  ];

  const filteredUsers = users.filter((user) => {
    const value = search.toLowerCase();

    return (
      user.name.toLowerCase().includes(value) ||
      user.email.toLowerCase().includes(value) ||
      user.role.toLowerCase().includes(value) ||
      user.branch.toLowerCase().includes(value)
    );
  });

  return (
    <div className="users-content">

      {/* ================= USERS CARD ================= */}

      <section className="users-card">

        {/* USERS HEADER */}

        <div className="users-header">

          <div className="users-title">

            <h2>
              Users
            </h2>

            <div className="user-search">

              <span className="search-icon">
                ⌕
              </span>

              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

            </div>

          </div>

          <button className="invite-btn">
            + Invite User
          </button>

        </div>


        {/* TABLE HEADER */}

        <div className="users-table-header">

          <div>USER</div>
          <div>ROLE</div>
          <div>BRANCH</div>
          <div>LAST LOGIN</div>
          <div>STATUS</div>

        </div>


        {/* USER ROWS */}

        <div className="users-list">

          {filteredUsers.map((user) => (

            <div
              className="user-row"
              key={user.email}
            >

              {/* USER */}

              <div className="user-info">

                <div className="user-avatar">
                  {user.initials}
                </div>

                <div>

                  <div className="user-name">
                    {user.name}
                  </div>

                  <div className="user-email">
                    {user.email}
                  </div>

                </div>

              </div>


              {/* ROLE */}

              <div className="user-role">
                {user.role}
              </div>


              {/* BRANCH */}

              <div className="user-branch">
                {user.branch}
              </div>


              {/* LAST LOGIN */}

              <div className="last-login">
                {user.lastLogin}
              </div>


              {/* STATUS */}

              <div>

                <span
                  className={`user-status ${
                    user.status === "ACTIVE"
                      ? "active"
                      : "inactive"
                  }`}
                >
                  {user.status}
                </span>

              </div>

            </div>

          ))}

        </div>

      </section>


      {/* ================= STYLES ================= */}

      <style>{`

        .users-content {
          width: 100%;
        }

        /* USERS CARD */

        .users-card {
          background: #fff;
          border: 1px solid #e1dfd8;
          border-radius: 15px;
          overflow: hidden;
        }

        /* USERS HEADER */

        .users-header {
          min-height: 66px;
          padding: 0 20px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          border-bottom: 1px solid #e3e0d8;
        }

        .users-title {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .users-header h2 {
          margin: 0;

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size: 17px;
          font-weight: 400;

          color: #11140f;
        }

        /* SEARCH */

        .user-search {
          width: 320px;
          height: 35px;

          border-radius: 11px;

          background: #f5f4f0;
          border: 1px solid #e2dfd8;

          display: flex;
          align-items: center;

          padding: 0 11px;
        }

        .search-icon {
          font-size: 17px;
          color: #aaa69f;
          margin-right: 7px;
        }

        .user-search input {
          width: 100%;

          border: none;
          outline: none;

          background: transparent;

          font-family: monospace;
          font-size: 9px;

          color: #555;
        }

        .user-search input::placeholder {
          color: #aaa69f;
        }

        /* INVITE */

        .invite-btn {
          height: 32px;

          padding: 0 15px;

          border: none;
          border-radius: 11px;

          background: #111410;
          color: #fff;

          font-family: monospace;
          font-size: 9px;

          cursor: pointer;
        }

        /* TABLE HEADER */

        .users-table-header {
          height: 38px;

          display: grid;

          grid-template-columns:
            2.1fr
            1.9fr
            1.55fr
            1.6fr
            0.9fr;

          align-items: center;

          padding: 0 20px;

          border-bottom: 1px solid #e3e0d8;

          color: #aaa69e;

          font-family: monospace;
          font-size: 7px;
          letter-spacing: 0.6px;
        }

        /* USER ROW */

        .user-row {
          min-height: 61px;

          display: grid;

          grid-template-columns:
            2.1fr
            1.9fr
            1.55fr
            1.6fr
            0.9fr;

          align-items: center;

          padding: 0 20px;

          border-bottom: 1px solid #e3e0d8;
        }

        .user-row:last-child {
          border-bottom: none;
        }

        /* USER INFO */

        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-avatar {
          width: 32px;
          height: 32px;

          flex-shrink: 0;

          border-radius: 50%;

          background: #f0f3ed;
          border: 1px solid #dce4d7;

          display: flex;
          align-items: center;
          justify-content: center;

          font-family: monospace;
          font-size: 8px;

          color: #6c7768;
        }

        .user-name {
          font-family: monospace;
          font-size: 11px;

          color: #11140f;

          margin-bottom: 2px;
        }

        .user-email {
          font-family: monospace;
          font-size: 8px;

          color: #aaa69e;
        }

        .user-role,
        .user-branch,
        .last-login {
          font-family: monospace;
          font-size: 9px;

          color: #817e77;
        }

        /* STATUS */

        .user-status {
          display: inline-block;

          padding: 6px 11px;

          border-radius: 9px;

          font-family: monospace;
          font-size: 8px;
        }

        .user-status.active {
          background: #e8f0e4;
          color: #63755c;
        }

        .user-status.inactive {
          background: #e9e7e1;
          color: #969188;
        }

        /* RESPONSIVE */

        @media (max-width: 1000px) {

          .users-card {
            overflow-x: auto;
          }

          .users-table-header,
          .user-row {
            min-width: 950px;
          }

        }

        @media (max-width: 700px) {

          .users-title {
            flex-direction: column;
            align-items: flex-start;
          }

          .users-header {
            height: auto;
            padding: 15px;

            gap: 15px;
          }

          .user-search {
            width: 240px;
          }

        }

      `}</style>

    </div>
  );
};

export default Users;