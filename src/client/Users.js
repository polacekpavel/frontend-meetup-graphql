import React, { Component } from "react";

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowDetail: true,
      users: [{
        id: 1,
        firstName: 'Pavel',
        lastName: 'Polacek',
        github: {
          id: 'polacekpavel'
        }
      }, {
        id: 2,
        firstName: 'Michal',
        lastName: 'Klacko',
        github: {
          id: 'miklacko'
        }
      }]
    };
  }

  render() {
    return (
      <div>
        {
          this.state.users && this.state.users.sort((a, b) => a.id - b.id).map((item) => {
            return <div key={item.id} className="row" onClick={() => {
              if (this.props.onClick) {
                this.props.onClick(item);
              }
            }
            }>
              {item.id} : {item.firstName} {item.lastName}
            </div>;
          })
        }

        <button className='btn btn-success'
                onClick={() => {
                }
                }>
          Load more
        </button>
      </div>
    );
  }
}

export default Users;