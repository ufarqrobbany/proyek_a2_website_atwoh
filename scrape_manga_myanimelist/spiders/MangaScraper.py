import scrapy

class MangaScraper(scrapy.Spider):
    name = 'manga'
    start_urls = ["https://myanimelist.net/topmanga.php"]
    page = 0

    def parse(self, response):
        for mangas in response.css('tr.ranking-list'):
            link = mangas.css('a.hoverinfo_trigger::attr(href)').get()
            yield response.follow(link, callback=self.parse_manga_page)

        next_page = response.css('a.link-blue-box.next::attr(href)').get()
        if next_page is not None:
            next_page_url = response.urljoin(next_page)
            self.page += 1
            yield response.follow(next_page_url, callback=self.parse)

    def parse_manga_page(self, response):
        title = response.css('span[itemprop="name"]::text').get()
        image_url = response.css('div.leftside > div:first-child > a > img::attr(data-src)').get()
        rank = response.css('span.numbers.ranked > strong::text').get()
        popularity = response.css('span.numbers.popularity > strong::text').get()
        rating = response.css('div.score-label::text').get()
        type = response.xpath('//div[contains(span[@class="dark_text"], "Type:")]/a/text()').get()
        volume = response.xpath('//div[contains(span[@class="dark_text"], "Volumes:")]/text()').get()
        chapter = response.xpath('//div[contains(span[@class="dark_text"], "Chapters:")]/text()').get()
        status = response.xpath('//div[contains(span[@class="dark_text"], "Status:")]/text()').get()
        genres = f(response, "Genres:", "Genre:")
        themes = f(response, "Themes:", "Theme:")
        demographic = f(response, "Demographics:", "Demographic:")
        publish = response.xpath('//div[contains(span[@class="dark_text"], "Published:")]/text()').get()
        authors_text = response.xpath('//div[@class="spaceit_pad"]/span[@class="dark_text"][contains(text(), "Authors")]/following-sibling::a/text()').getall()
        authors = [i.replace(", ", " ") for i in authors_text]
        decription_text = response.css('span[itemprop="description"]').get()
        synopsis = scrapy.Selector(text=decription_text).xpath('//text()').getall()
        synopsis = ' '.join(synopsis).replace('\r\n', '').replace('\n', '').replace('\r', '').replace('\t', '').strip()

        item = {
            'rank': rank[1:],
            'title': title,
            'url': response.url,
            'image_url': image_url,
            'rating': rating,
            'popularity': popularity.replace("#", ""),
            'type': type.strip(),
            'volumes': volume.strip(),
            'chapters': chapter.strip(),
            'status': status.strip(),
            'genres': genres,
            'themes': themes,
            'demographic': demographic,
            'publish': publish.strip().replace("  ", " "),
            'authors': authors,
            'synopsis': synopsis
        }

        yield item

def f(response, x, y):
    b = None
    a = response.css("div.spaceit_pad")
    for i in range(len(a)):
        if a[i].css("span::text").get() == x or a[i].css("span::text").get() == y:
            b = a[i]
    if b == None:
        return []
    item = []
    c = b.css("span")
    for i in range(len(c)):
        if c[i].css("::text").get() != x and c[i].css("::text").get() != y:
            item.append(c[i].css("::text").get())
    return item