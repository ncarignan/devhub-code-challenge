import React from 'react';



class Cart extends React.Component {
  render() {
    return (
      <div>
        <form>
          <input name="item" defaultValue="buy me"></input>
          <input name="item" type="submit"></input>
        </form>
      </div>
    );
  }
}

export default Cart;