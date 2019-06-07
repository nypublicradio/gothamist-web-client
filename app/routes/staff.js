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
      image: '/static-images/staff/jen-chung.jpg',
      bio: "Jen grew up in New Jersey and co-founded Gothamist in 2003 as a way to learn more about New York City beyond Law & Order. She attended Columbia University, likes learning about NYC infrastructure, hates when people wear backpacks on crowded subways, and loves bodega cats. She also yells at cars for not obeying stop signs.",
      contact: {
        twitter: 'jenchung',
        email: 'jen@gothamist.com',
      },
    }, {
      name: 'Jake Dobkin',
      title: 'Publisher and co-founder',
      image: '/static-images/staff/jake-dobkin.jpg',
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
      image: '/static-images/staff/john-del-signore.jpg',
      bio: "Originally from the Albany area, John Del Signore has called NYC home since 1995. In addition to his thousands of meticulously-crafted bespoke blog posts for Gothamist, his writing has also been published in The Awl, Deadspin, The Nervous Breakdown, and performed at The Brick Theater in Brooklyn.",
      contact: {
        email: 'johnd@gothamist.com',
        twitter: 'johndelsignore',
      },
    }, {
      name: 'Jen Carlson',
      title: 'Editorial Director',
      image: '/static-images/staff/jen-carlson.jpg',
      bio: 'Jen Carlson has been with Gothamist since 2004 and is currently Editorial Director. Her writing has also been published on Jezebel, Deadspin, and a number of composition notebooks before the internet existed. In 2015 she won a spot in the inaugural Amtrak Residency program and traveled the nation via rail. She has an Ed Hardy tattoo, but she can explain... ',
      contact: {
        email: 'jencarlson@gothamist.com',
        twitter: 'jenist',
      },
    }, {
      name: 'Ben Yakas',
      title: 'Arts & Culture Editor',
      image: '/static-images/staff/ben-yakas.jpg',
      bio: 'Ben Yakas was born and raised in NY, and has worked for Gothamist for a decade covering literally everything. He has written for WNYC, The Encyclopedia of NYC, and several little-read poetry journals; he also had a brief stint at Vandelay Industries. He is a musician/producer, a “Fast & The Furious” aficionado, and a pizza connoisseur. He has hung out with Dan Smith (who will teach you guitar), but still has yet to have a guitar lesson with him.',
      contact: {
        email: 'benyakas@gothamist.com',
        twitter: 'yenbakas',
      },
    }, {
      name: 'Christopher Robbins',
      title: 'City Editor',
      image: '/static-images/staff/christopher-robbins.jpg',
      bio: 'Christopher Robbins has worked for Gothamist for nearly six years, covering transportation, affordable housing, local politics, and criminal justice. His work has also appeared in The Village Voice and The New York Times. Chris is a graduate of Patrick Henry High School in Roanoke, Virginia, and enjoys biking to Fort Tilden in the summertime.',
      contact: {
        email: 'chris@gothamist.com',
        twitter: 'christrobbins',
      },
    }, {
      name: 'Elizabeth Kim',
      title: 'Senior Editor',
      image: '/static-images/staff/elizabeth-kim.jpg',
      bio: 'Elizabeth Kim has worked at Gothamist since January 2019. She covers housing, zoning, development, and other real estate issues, including the city’s rat epidemic. Prior to Gothamist, she was a senior editor at The Real Deal and a reporter at The Stamford Advocate. Born and raised in Queens, Elizabeth spent her youth riding the No. 7 train to Manhattan. She now lives in Yorkville with her husband and two sons. She enjoys dancing, exploring the city, and talking to strangers.',
      contact: {
        email: 'ekim@gothamist.com',
        twitter: 'lizkimtweets',
      }
    }, {
      name: 'Paula Mejía',
      title: 'Reporter',
      image: '/static-images/staff/paula-mejia.jpg',
      bio: "Paula Mejía was born in New York City to Colombian immigrants and grew up in Houston, Texas. Before covering culture, arts, activism, subway blobs, swamps, and other ephemera at Gothamist, she was an editor at Atlas Obscura and for NPR Music's Turning the Tables series. Her work has also appeared in The New Yorker, The New York Times, and The Paris Review. Paula has a master's from George Washington University, rarely turns down a chance to do karaoke, and knows the \"correct\" way to pronounce Houston Street...but that doesn't mean she likes it.",
      contact: {
        email: 'pmejia@gothamist.com',
        twitter: 'tenaciouspm',
      }
    }, {
      name: 'Jake Offenhartz',
      title: 'Reporter',
      image: '/static-images/staff/jake-offenhartz.jpg',
      bio: 'Jake Offenhartz has been at Gothamist since 2017, covering all things transit, policing, local politics, and the occasional bagel scandal. Born in New York City, he was banished to the suburbs at a young age after supposedly befriending a large rat in Riverside Park. He made it back to the city, thankfully, and now lives in Bushwick with a mutt named Nancy. His position on rodent friendships has since evolved.',
      contact: {
        email: 'joffenhartz@gothamist.com',
        twitter: 'jangelooff'
      }
    }, {
      name: 'Tom Stern',
      title: 'Senior Account Executive, Digital Sales',
      image: '/static-images/staff/tom-stern.jpg',
      bio: 'Born and raised in Boston, Tom Stern has lived behind enemy lines here in NYC for almost a decade, rooting for his beloved Patriots, Red Sox, Celtics, and Bruins all the while. Tom joined the Gothamist team in 2014 and leads all things Sales. Tom has an outrageously cute Black Lab named Goose, seen here sleeping on the job at the old Gothamist HQ.',
      contact: {
        email: 'thomas@gothamist.com',
        phone: '(646) 829-4392',
      },
    }, {
      name: 'Mei Lee',
      title: 'Ad Operations Manager',
      image: '/static-images/staff/mei-lee.jpg',
      bio: 'Mei is a native New Yorker who joined Gothamist as an intern back in 2008 when the lunch options were basically Front Street Pizza and Grimaldi’s. She has lived in Queens and currently resides in Brooklyn, but is an equal opportunity consumer when it comes to the location of a delicious meal. Mei does not self-identify as a morning person and didn’t mean to greet you with a blank stare at 9 AM the other morning.',
      contact: {
        email: 'mlee@gothamist.com',
      }
    }]
  }
});
