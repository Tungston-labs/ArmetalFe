import React from 'react'

function Navbar() {
  return (
    <div>
      <TopBar>
              <div />
              <DropdownWrapper>
                <HRManager onClick={() => setMenuOpen(!menuOpen)}>
                  <img src="/images/user.jpg" alt="HR Manager" />
                  <IoIosArrowDown
                    size={18}
                    style={{ marginLeft: "5px", cursor: "pointer" }}
                  />
                </HRManager>
      
                {menuOpen && (
                  <DropdownMenu>
                    <div>Change Password</div>
                    <div>Logout</div>
                  </DropdownMenu>
                )}
              </DropdownWrapper>
            </TopBar>
    </div>
  )
}

export default Navbar
