# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
from itemadapter import ItemAdapter

import scrapy
from scrapy.pipelines.images import ImagesPipeline

class ScrapeMangaMyanimelistPipeline:
    def process_item(self, item, spider):
        return item


class ImagePipeline(ImagesPipeline):
    def file_path(self, request, response=None, info=None, *, item=None):
        media_guid = request.url.split('/')[-1]
        return f'{item["rank"]}_{media_guid}'

    def get_media_requests(self, item, info):
        if item['image_url']:
            yield scrapy.Request(item['image_url'])

