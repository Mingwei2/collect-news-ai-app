import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { OpenAiService } from './openai.service';
import { TaskResult } from 'src/entities/taskResult.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class NewsService {

    private readonly newsApiKey: string;
    private readonly newsApiUrl = 'https://newsapi.org/v2/everything';

    constructor(private readonly httpService: HttpService, private readonly openAiService: OpenAiService,
        @InjectRepository(TaskResult)
        private taskResultsRepository: Repository<TaskResult>) {
        this.newsApiKey = process.env.NEWS_API_KEY || '';
    }

    async getNews(keywords: string) {
        // Calculate date for the last 24 hours
        const toDate = new Date().toISOString().split('T')[0]; // Today's date in YYYY-MM-DD format
        const fromDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // Yesterday's date

        const response = await firstValueFrom(this.httpService.get(this.newsApiUrl, {
            params: {
                apiKey: this.newsApiKey,
                q: keywords,
                from: fromDate,
                to: toDate,
                sortBy: 'publishedAt',
                pageSize: 10,
            },
        }));

        return response.data.articles.map(article => ({
            title: article.title,
            description: article.description,
            url: article.url,
            source: article.source.name,
            publishedAt: article.publishedAt,
        }));
    }

    async analyzeNewsByAI(taskId: string, keywords: string, analysisMethod: string) {
        const news = await this.getNews(keywords);
        const newsString = news.map(article => `${article.title}\n${article.description}\n${article.url}`).join('\n');
        const response = await this.openAiService.createChatCompletion([{ role: 'user', content: newsString }, { role: 'system', content: '你是新闻分析师，需要分析新闻，并给出新闻的摘要，使用' + analysisMethod + '的分析方法' }]);
        const taskResult = new TaskResult();
        taskResult.taskId = taskId;
        taskResult.result = response.message || '';
        taskResult.createdAt = new Date();
        await this.taskResultsRepository.save(taskResult);
        return response.message;
    }
}
