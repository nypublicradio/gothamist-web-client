import { Factory, faker, trait } from 'ember-cli-mirage';

import {
  section,
} from './consts';

export default Factory.extend({
  meta: () => ({
    first_published_at: "2019-06-25T15:37:41.806033-04:00",
    type: "home.HomePage",
    detail_url: "https://cms.demo.nypr.digital/api/v2/pages/3/",
    html_url: "https://cms.demo.nypr.digital/",
    slug: "home"
  }),
  title: "Home",
  hasFeaturedCollection: trait({
    afterCreate(homepage, server) {
      homepage.update({
        page_collection_relationship: [{
          title: "Featured Article Collection",
          pages: server.createList("article", 4, section,
          {title: faker.list.cycle("Insignificant Blizzard Can't Stop Cronut Fans From Lining Up This Morning",
          "Gorgeous Mandarin Duck, Rarely Seen In U.S., Mysteriously Appears In Central Park", "Delicious Tibetan Momos And Noodles At New East Village Location Of Lhasa",
          "SEE IT: Cynthia Nixon Orders Cinnamon Raisin Bagel With... Lox And Capers",
          "Rent Now Slightly Less Too Damn High In Manhattan"),
          show_as_feature: true,
        })
        }]
      });
    }
  }),
});
