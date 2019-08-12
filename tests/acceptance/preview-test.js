import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import config from '../../config/environment';

module('Acceptance | preview', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(() => {
    server.logging = true;
    server.urlPrefix = config.cmsServer;
    server.get('/api/v2/page_preview', () => {
    return {
        "id": 26,
        "meta": {
            "first_published_at": "2019-07-30T20:44:52.762000Z",
            "type": "news.ArticlePage",
            "detail_url": "http://localhost/api/v2/pages/26/",
            "html_url": "http://localhost/news/turtles-all-way-down/",
            "slug": "turtles-all-way-down",
            "show_in_menus": true,
            "seo_title": "",
            "search_description": "",
            "parent": {
                "id": 8,
                "meta": {
                    "type": "standardpages.IndexPage",
                    "detail_url": "http://localhost/api/v2/pages/8/",
                    "html_url": "http://localhost/news/"
                },
                "title": "News"
            }
        },
        "title": "Turtles All The Way Down",
        "listing_title": "",
        "listing_summary": "",
        "listing_image": null,
        "social_image": null,
        "social_title": "",
        "social_text": "",
        "show_on_index_listing": true,
        "publication_date": null,
        "updated_date": null,
        "description": "",
        "lead_asset": [
            {
                "type": "lead_image",
                "value": {
                    "image": 4,
                    "caption": ""
                },
                "id": "7c2c2b76-07c6-4464-ad7d-7db63ac72536"
            }
        ],
        "body": [
            {
                "type": "paragraph",
                "value": "<p>Stephen Hawking&#x27;s A Brief History of Time tells the story of a cosmologist whose speech is interrupted by a little old lady who informs him that the universe rests on the back of a turtle. &quot;Ah, yes, madame,&quot; the scientist replies, &quot;but what does the turtle rest on?&quot; The old lady shoots back: &quot;You can&#x27;t trick me, young man. It&#x27;s nothing but turtles, turtles, turtles, all the way down.&quot;</p>",
                "id": "417132fb-764f-43ae-93dd-82d3e61675d3"
            }
        ],
        "sponsored_content": false,
        "disable_comments": false,
        "provocative_content": false,
        "sensitive_content": false,
        "related_links": [],
        "related_authors": [
            {
                "id": 5,
                "first_name": "Jane",
                "last_name": "Doe",
                "photo": 4,
                "job_title": "Test Person",
                "biography": "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
                "website": "",
                "email": "",
                "slug": "jane-doe"
            }
        ],
        "related_contributing_organizations": [
            {
                "id": 1,
                "name": "Contribution Org example 1",
                "slug": "corg-1",
                "external_link": null
            }
        ],
        "related_sponsors": [],
        "tags": [],
        "show_as_feature": false,
        "legacy_id": null,
        "ancestry": [
            {
                "id": 8,
                "meta": {
                    "type": "standardpages.IndexPage",
                    "detail_url": "http://localhost/api/v2/pages/8/",
                    "html_url": "http://localhost/news/"
                },
                "title": "News",
                "slug": "news"
            },
            {
                "id": 3,
                "meta": {
                    "type": "home.HomePage",
                    "detail_url": "http://localhost/api/v2/pages/3/",
                    "html_url": "http://localhost/"
                },
                "title": "Home",
                "slug": "home"
            },
            {
                "id": 1,
                "meta": {
                    "type": "wagtailcore.Page",
                    "detail_url": "http://localhost/api/v2/pages/1/",
                    "html_url": null
                },
                "title": "Root",
                "slug": "root"
            }
        ]
    }

    })

  });

  test('visiting preview article', async function(assert) {
    await visit('/preview?identifier=abc&token=def');

    assert.equal(currentURL(), '/preview?identifier=abc&token=def');
    assert.dom('[data-test-article-headline]').hasText("Turtles All The Way Down");
    assert.dom('[data-test-article-body]').includesText('A Brief History of Time');
    assert.dom('[data-test-article-body] [data-test-inserted-ad]').exists({count: 1})
  });
});
