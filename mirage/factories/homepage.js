import { Factory } from 'ember-cli-mirage';

export default Factory.extend({
  meta: () => ({
    first_published_at: "2019-06-25T15:37:41.806033-04:00",
    type: "home.HomePage",
    detail_url: "https://cms.demo.nypr.digital/api/v2/pages/3/",
    html_url: "https://cms.demo.nypr.digital/",
    slug: "home"
  }),
  title: "Home",
  page_collection_relationship: () => ([{
    title: "WNYC Cross-Posting",
    pages: []
  }])
});
