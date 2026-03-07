import { News } from '../types';

export const news: News[] = [
    {
        id: 'news-001',
        date: '2026-03-07',
        title: {
            zh: '号召踊跃投稿与捐赠',
            en: 'Call for Submissions and Donations'
        },
        content: {
            zh: `
欢迎来到 L.A.J.I. JOURNAL！

我们是一本致力于传播高度可疑、极其具体且无意中令人捧腹的学术研究的国际期刊。

## 踊跃投稿
我们极其需要各种荒诞不经但又写得一本正经的研究论文。无论您是研究猫咪流体力学，还是论证吃沙县小吃与开法拉利的关系，我们都欢迎！
请参考我们的[投稿指南](#)并按照 Markdown 模板格式提交您的旷世杰作。

## 捐赠支持
本期刊独立运营，如果不捐赠，主编可能连明天早上的咖啡都买不起了。
前往 [捐赠页](#) 对本期刊进行支持！您的每一分钱都将用于保持服务器运转，以及主编的精神状态。
      `,
            en: `
Welcome to L.A.J.I. JOURNAL!

We are an international journal dedicated to the dissemination of highly questionable, absurdly specific, and unintentionally hilarious academic research.

## Call for Submissions
We desperately need all sorts of absurd but academically serious-looking research papers. Whether you're studying feline fluid mechanics or proving the relationship between eating cheap street food and driving a Ferrari, we welcome it!
Please refer to our [Submission Guide](#) and submit your masterpiece using the Markdown template format.

## Donate
This journal operates independently. Without donations, the Editor-in-Chief might not be able to afford tomorrow morning's coffee.
Head over to the [Donation Page](#) to support the journal! Every cent will go towards keeping the servers running and maintaining the Editor-in-Chief's mental state.
      `
        }
    }
];
