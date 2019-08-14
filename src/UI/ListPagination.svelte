<script>
export let articlesCount
export let currentPage

function getPageList({ articlesCount, currentPage }) {
  const range = [];
  for (let i = 0; i < Math.ceil(articlesCount / 10); ++i) {
    range.push({ number: i, isCurrent: i === currentPage });
  }
  return range;
}

$: pages = getPageList({ articlesCount, currentPage })

</script>

{ #if (articlesCount <= 10 }
{ :else }
  <nav>
    <ul class="pagination">
      { # each pages as page (String(page.number)) }
          <li
            class={page.isCurrent ? "page-item active" : "page-item"}
          >
            <a class="page-link" href="">
              {page.number + 1}
            </a>
          </li>
      { /each
    </ul>
  </nav>
{ /if }
