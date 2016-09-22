/**
 * @fileoverview This file contains text constants used for rendering the
 *   content in the page.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

module.exports = {
  skills: [
    {
      text: 'HTML/CSS',
      image: '/public/img/html.png',
      value: 9
    },
    {
      text: 'CSS',
      image: '/public/img/css.png',
      value: 8
    },
    {
      text: 'JavaScript',
      image: '/public/img/js.png',
      value: 10
    },
    {
      text: 'NodeJS',
      image: '/public/img/nodejs.png',
      value: 10
    },
    {
      text: 'Python',
      image: '/public/img/python.png',
      value: 9
    }
  ],
  work: [
    {
      name: 'SchoolYourself Inc',
      description: 'An online education MOOC (Massive Open Online Course) that I developed interactive geometry curriculum for using JavaScript. This content has been used by over 55,000 people around the world. I also integrated the educational content with commercial Learning Management Systems by setting up an authentication protocol allowing it to be embedded in providers such as BrightSpace, Canvas, Moodle, etc.',
      link: 'https://schoolyourself.org',
      linkText: 'Homepage',
      image: '/public/img/schoolyourself.png'
    },
    {
      name: 'email-alerts',
      description: 'This npm module is a wrapper around the sendgrid module meant for quick and easy email/alert sending.',
      link: 'https://www.npmjs.com/package/email-alerts',
      linkText: 'npm registry',
      image: '/public/img/npm.png'
    },
    {
      name: 'nycurl',
      description: 'A web server that fetches data from the New York Times and formats it for display in the terminal. Use "curl nycurl.sytes.net" from your terminal to use thie application',
      link: 'http://nycurl.sytes.net',
      linkText: 'Link',
      image: 'public/img/nycurl.png'
    },
    {
      name: 'Bouncy Square',
      description: 'Bouncy Square is an addictive casual game involving hand-eye coordination. Tap the left and right sides of the screen to rotate the square clockwise and counterclockwise. Tilt your device to move the square left and right. To bounce, you have to land on the platform with the side of the square that has the same color as the platform. Get as far as you can!',
      link: 'https://play.google.com/store/apps/details?id=io.github.omgimanerd.bouncysquare',
      linkText: 'Get It Here!',
      image: '/public/img/bouncysquare.png'
    },
    {
      name: 'Shockwave',
      description: 'Shockwave is a two-player game in which both players can tap the screen to create a shockwave that will push the ball away from it. To prevent either player from simply mashing the screen, tapping is only allowed if the other player has tapped or after two seconds have elapsed. The goal of the game is to push the ball into the opposing player\'s goal.',
      link: 'https://play.google.com/store/apps/details?id=io.github.omgimanerd.shockwave',
      linkText: 'Get It Here!',
      image: '/public/img/shockwave.png'
    },
    {
      name: 'Tap',
      description: 'Tap is a game of speed where balls of four different colors will appear and move in a wave across the screen. You must tap the ball when it is on top of the stripe that corresponds to it\'s color. You lose when you let a ball reach the other side of the screen or if you tap one when it is on top of the wrong color.',
      link: 'https://play.google.com/store/apps/details?id=io.github.omgimanerd.tap',
      linkText: 'Get It Here!',
      image: '/public/img/tap.png'
    }
  ]
};
