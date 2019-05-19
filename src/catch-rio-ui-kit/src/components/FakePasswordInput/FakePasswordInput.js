import React from 'react';

const sx = {
  position: 'absolute',
  left: -9999,
};

class FakePasswordInput extends React.PureComponent {
  render() {
    return (
      <div style={sx}>
        <input type="text" name="fakeusernameremembered" />
        <input type="password" name="fakepasswordremembered" />
      </div>
    );
  }
}

export default FakePasswordInput;
