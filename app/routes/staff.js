import Route from '@ember/routing/route';
import { inject } from '@ember/service';

export default Route.extend({
  header: inject('nypr-o-header'),

  titleToken: 'Staff',

  beforeModel() {
    this.header.addRule('staff.index', {
      all: {
        nav: true,
        donate: true,
        search: true,
      }
    });
  },

  model() {
    return [{
      name: 'Jen Chung',
      title: 'Executive editor and co-founder',
      image: '/images/staff/jen-chung.jpg',
      bio: "Jen, a New Jersey-born New Yorker, edits Gothamist. She attended Columbia University, likes learning about NYC infrastructure (the subway system's intricacies, how engineers design skyscrapers), and hopes that one day a NYC zoo will have pandas. Her favorite TV shows are usually crime procedurals set in New York City, preferably with a chung-chung sound effect. She also yells at cars for not obeying stop signs.",
      contact: {
        twitter: 'jenchung',
        email: 'jen@gothamist.com',
      },
    }, {
      name: 'Jake Dobkin',
      title: 'Publisher and co-founder',
      image: '/images/staff/jake-dobkin.jpg',
      bio: 'Jake was born and lives in Brooklyn. He attended PS321, JHS51, Stuyvesant, Columbia, and NYU, where he got an MBA. He claims to have never been away from New York City for more than ten weeks in the last thirty-nine years. Surprisingly, his mortal enemy is... milk. You can learn more about Jake at facebook.com/jakedobkin or twitter.com/jakedobkin.',
      contact: {
        instagram: 'jakedobkin',
        twitter: 'jakedobkin',
        facebook: 'jakedobkin',
        email: 'jake@gothamist.com',
      },
    }, {
      name: 'John Del Signore',
      title: 'Editor-in-chief',
      image: '/images/staff/john-del-signore.jpg',
      bio: "Originally from the Albany area, John Del Signore has called NYC home since 1995. In addition to his thousands of meticulously-crafted bespoke blog posts for Gothamist, his writing has also been published in The Awl, Deadspin, The Nervous Breakdown, and in electrifying theatrical form at The Brick Theater. He currently lives in Williamsburg, but it's not what you think.",
      contact: {
        email: 'johnd@gothamist.com',
        twitter: 'johndelsignore',
      },
    }, {
      name: 'Jen Carlson',
      title: 'Editorial Director',
      image: '/images/staff/jen-carlson.jpg',
      bio: 'Jen Carlson has been with Gothamist since 2004 and is currently Editorial Director of Gothamist LLC. Her writing has also been published on Jezebel, Deadspin, and a number of composition notebooks before the internet existed. In 2015 she won a spot in the inaugural Amtrak Residency program and traveled the nation via rail. She has an Ed Hardy tattoo, but she can explain...',
      contact: {
        email: 'jencarlson@gothamist.com',
        twitter: 'jenist',
      },
    }, {
      name: 'Ben Yakas',
      title: 'Arts & Culture Editor',
      image: '/images/staff/ben-yakas.jpg',
      bio: 'Ben Yakas was born and raised in NY, and has written for WNYC, The Encyclopedia of NYC, and several little-read poetry journals; he also had a brief stint at Vandelay Industries. He has a giant poster of the legendary Dan Smith (who will teach you guitar), but still has yet to have a guitar lesson with him. He subsists on a diet of chinese food, billiards and concerts, and firmly believes that between here and there is better than either here or there.',
      contact: {
        email: 'benyakas@gothamist.com',
        twitter: 'yenbakas',
      },
    }, {
      name: 'Christopher Robbins',
      title: 'City Editor',
      image: '/images/staff/christopher-robbins.jpg',
      bio: 'Christopher Robbins has worked for Gothamist for nearly six years, covering transportation, affordable housing, local politics, and criminal justice. His work has also appeared in The Village Voice and The New York Times. Chris is a graduate of Patrick Henry High School in Roanoke, Virginia, and enjoys biking to Fort Tilden in the summertime.',
      contact: {
        email: 'chris@gothamist.com',
        twitter: 'christrobbins'
      },
    }]
  }
});
