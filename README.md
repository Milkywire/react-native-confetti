# react-native-confetti

Finally a good confetti for React Native!

This is a port of [react-dom-confetti](https://github.com/daniel-lundin/react-dom-confetti) so all parameters from there are supported

![demo.gif](demo.gif)

## Installation

`npm install --save @milkywire/react-native-confetti`

## Usage

A confetti that fires every at a certain interval:

```js

import Confetti from '@milkywire/react-native-confetti';

function ConfettiInterval({ interval }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive(active => !active);
    }, interval/2);
    return () => clearInterval(timer);
  }, [interval])

  return <Confetti active={active}/>;
}
```

## License

Copyright 2019 Milkywire

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
