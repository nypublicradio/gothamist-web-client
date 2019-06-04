import Route from '@ember/routing/route';
import { inject } from '@ember/service';

export default Route.extend({
  header: inject('nypr-o-header'),

  titleToken: 'Staff',

  beforeModel() {
    this.header.addRule('staff', {
      all: {
        nav: true,
        donate: true,
        search: true,
      },
      resting: {
        leaderboard: true,
      },
    });
  },

  model() {
    return [{
      name: 'Jen Chung',
      title: 'Executive editor and co-founder',
      image: '/images/staff/jen-chung.jpg',
      bio: "Jen grew up in New Jersey and co-founded Gothamist in 2003 as a way to learn more about New York City beyond Law & Order. She attended Columbia University, likes learning about NYC infrastructure, hates when people wear backpacks on crowded subways, and loves bodega cats. She also yells at cars for not obeying stop signs.",
      contact: {
        twitter: 'jenchung',
        email: 'jen@gothamist.com',
      },
    }, {
      name: 'Jake Dobkin',
      title: 'Publisher and co-founder',
      image: '/images/staff/jake-dobkin.jpg',
      bio: 'Jake was born and lives in Brooklyn. He attended PS321, JHS51, Stuyvesant, Columbia, and NYU, where he got an MBA. He claims to have never been away from New York City for more than ten weeks since 1976. In 2019, Jake released <a href="https://www.amazon.com/Ask-Native-New-Yorker-Hard-Earned/dp/141972908X/" target="_blank" rel="noopener">Ask a Native New Yorker</a>, a book based on his <a href="/tags/askanativenewyorker" class="ember-view">Gothamist advice column</a>.',
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
      bio: "Originally from the Albany area, John Del Signore has called NYC home since 1995. In addition to his thousands of meticulously-crafted bespoke blog posts for Gothamist, his writing has also been published in The Awl, Deadspin, The Nervous Breakdown, and performed at The Brick Theater in Brooklyn.",
      contact: {
        email: 'johnd@gothamist.com',
        twitter: 'johndelsignore',
      },
    }, {
      name: 'Jen Carlson',
      title: 'Editorial Director',
      image: '/images/staff/jen-carlson.jpg',
      bio: 'Jen Carlson has been with Gothamist since 2004 and is currently Editorial Director. Her writing has also been published on Jezebel, Deadspin, and a number of composition notebooks before the internet existed. In 2015 she won a spot in the inaugural Amtrak Residency program and traveled the nation via rail. She has an Ed Hardy tattoo, but she can explain... ',
      contact: {
        email: 'jencarlson@gothamist.com',
        twitter: 'jenist',
      },
    }, {
      name: 'Ben Yakas',
      title: 'Arts & Culture Editor',
      image: '/images/staff/ben-yakas.jpg',
      bio: 'Ben Yakas was born and raised in NY, and has worked for Gothamist for a decade covering literally everything. He has written for WNYC, The Encyclopedia of NYC, and several little-read poetry journals; he also had a brief stint at Vandelay Industries. He is a musician/producer, a “Fast & The Furious” aficionado, and a pizza connoisseur. He has hung out with Dan Smith (who will teach you guitar), but still has yet to have a guitar lesson with him.',
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
        twitter: 'christrobbins',
      },
    }, {
      name: 'Elizabeth Kim',
      title: 'Senior Editor',
      image: '/images/staff/elizabeth-kim.jpg',
      bio: '',
      contact: {
        email: 'ekim@gothamist.com',
        twitter: 'lizkimtweets',
      }
    }, {
      name: 'Paula Mejía',
      title: 'Reporter',
      image: '/images/staff/paula-mejia.jpg',
      bio: "Paula Mejía was born in New York City to Colombian immigrants and grew up in Houston, Texas. Before covering culture, arts, activism, subway blobs, swamps, and other ephemera at Gothamist, she was an editor at Atlas Obscura and for NPR Music's Turning the Tables series. Her work has also appeared in The New Yorker, The New York Times, and The Paris Review. Paula has a master's from George Washington University, rarely turns down a chance to do karaoke, and knows the \"correct\" way to pronounce Houston Street...but that doesn't mean she likes it.",
      contact: {
        email: 'pmejia@gothamist.com',
        twitter: 'tenaciouspm',
      }
    }, {
      name: 'Jake Offenhartz',
      title: 'Reporter',
      image: '/images/staff/jake-offenhartz.jpg',
      bio: '',
      contact: {
        email: 'joffenhartz@gothamist.com',
        twitter: 'jangelooff'
      }
    }, {
      name: 'Tom Stern',
      title: 'Senior Account Executive, Digital Sales',
      image: '/images/staff/tom-stern.jpg',
      bio: 'Born and raised in Boston, Tom Stern has lived behind enemy lines here in NYC for almost a decade, rooting for his beloved Patriots, Red Sox, Celtics, and Bruins all the while. Tom joined the Gothamist team in 2014 and leads all things Sales. Tom has an outrageously cute Black Lab named Goose, seen here sleeping on the job at the old Gothamist HQ.',
      contact: {
        email: 'thomas@gothamist.com',
        phone: '(646) 829-4392',
      },
    }, {
      name: 'Mei Lee',
      title: 'Ad Operations Manager',
      image: '/images/defaults/no-category/no-category-tile.png',
      bio: '',
      contact: {
        email: 'mlee@gothamist.com',
        twitter: ''
      }
    }]
  }
});
