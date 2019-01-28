import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import Home from '../home/home';
import Cart from '../cart/cart';



class App extends React.Component {
  render() {
    return (
      <main className="main-content">
        <h1>hello</h1>
        {/* <Provider store={store}> */}
        <BrowserRouter>
          <div>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/cart">Cart</Link></li>
            </ul>
            <Route exact path="/" component={Home} />
            <Route exact path="/cart" component={Cart} />

          </div>
        </BrowserRouter>
        {/* </Provider> */}
      </main>
    );
  }
}

export default App;


