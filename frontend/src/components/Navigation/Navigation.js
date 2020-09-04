import React from "react";
import {
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Collapse,
  Button
} from "shards-react";


export default class NavBar extends React.Component {
  constructor(props) {
    super(props);

    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.toggleNavbar = this.toggleNavbar.bind(this);

    this.state = {
      dropdownOpen: false,
      collapseOpen: false
    };
  }

  toggleDropdown() {
    this.setState({
      ...this.state,
      ...{
        dropdownOpen: !this.state.dropdownOpen
      }
    });
  }

  toggleNavbar() {
    this.setState({
      ...this.state,
      ...{
        collapseOpen: !this.state.collapseOpen
      }
    });
  }

  render() {
    return (
      <Navbar type="dark" theme="primary" expand="md">
        <NavbarBrand href="#">Casualità</NavbarBrand>
        <NavbarToggler onClick={this.toggleNavbar} />

        <Collapse open={this.state.collapseOpen} navbar>
          <Nav navbar>
            <NavItem>
              <NavLink active href="#">
                Play!
              </NavLink>
            </NavItem>
          </Nav>

          <Nav navbar className="ml-auto">
            <NavItem>
                <NavLink active href="#">
                    Login
                </NavLink>
            </NavItem>
            <NavItem>
                <NavLink active href="#">
                    Sign up
                </NavLink>
            </NavItem>
            <NavItem>
                <Dropdown
                open={this.state.dropdownOpen}
                toggle={this.toggleDropdown}
                    >
                    <DropdownToggle nav caret>
                        Username
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem>My Profile</DropdownItem>
                        <DropdownItem>Wallet</DropdownItem>
                        <DropdownItem>Logout</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}