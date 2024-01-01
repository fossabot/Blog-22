import { DBSelect } from "../../SQL/dbSelect"
import { ReturnData } from "../../Return To Client";


export class GetArticleContent{

    returnData = new ReturnData();
    getArticleContentByKeyword = async (keyword:string) => {
        try {
            const dbSelect = new DBSelect();
            const articleCardData = await dbSelect.selectArticleByKeyword(keyword);
            const data = articleCardData.map(item => {
                return {
                    articleId: item.article_id,
                    articleTitle: item.article_title,
                    articleAuthor: item.u_name,
                    articleContent: item.article_content,
                    articleArea: item.article_area
                };
            });
            if(data.length === 0){
                return this.returnData.returnClientData(-101, 'Article Not Found');
            }
            return this.returnData.returnClientData(0, 'sucessful', data);
        } catch (error) {
            const returnData = this.returnData.returnClientData(-400, 'Error');
            console.log(error);
            return returnData;
        }

    }
}