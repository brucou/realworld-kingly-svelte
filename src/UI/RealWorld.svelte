<script>
import Banner from './Banner.svelte'
import Header from './Header.svelte'
import ArticleList from './ArticleList.svelte'
import Tags from './Tags.svelte'
import GlobalFeedTab from './GlobalFeedTab.svelte'

// TODO: Tags UI component
// TODO: run the UI first then review the tests and the branch
export let tags;
export let articles;
export let page;

$: articleList = articles.data;
$: articlesCount = articles.count;
$: tagList = tags.data;
$: tagsFetchStatus = tags.fetchStatus;
$: articlesFetchStatus = articles.fetchStatus;
$: currentPage = page;

</script>

<div >
  <Header  />
  <div class="home-page" data-testId="home-page">
      <Banner />

      <div class="container page">
        <div class="row">
          <div class="col-md-9">

            <div class="feed-toggle">
              <ul class="nav nav-pills outline-active">
                <GlobalFeedTab />
              </ul>
            </div>

            <ArticleList
              articles={articleList}
              articlesCount={articlesCount}
              currentPage={currentPage}
              fetchStatus={articlesFetchStatus}
            />

          </div>

          <div class="col-md-3">
            <div class="sidebar">
              <p>Popular Tags</p>

              <Tags tags={tagList} fetchStatus={tagsFetchStatus} />
            </div>
          </div>

        </div>
      </div>
  </div>
</div>
