/**
 * @description       : 
 * @author            : ChangeMeIn@UserSettingsUnder.SFDoc
 * @group             : 
 * @last modified on  : 02-13-2022
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
**/
public with sharing class knowledgeSearchController {
    //Get knowledge articles which contains input text
    @AuraEnabled(cacheable=true)
    public static List<Knowledge__kav> getKnowledgeArticles(String searchText) {
        List<Knowledge__kav> knowledgeArticlesList = new List<Knowledge__kav>();
        if (searchText != '' && searchText != null) {
            for(Knowledge__kav kav : [SELECT Id, Title, Summary,CreatedDate,ArticleCaseAttachCount,ArticleTotalViewCount,KnowledgeArticleId FROM Knowledge__kav where PublishStatus='Online']) {
                if(kav.Title.contains(searchText))
                {
                    knowledgeArticlesList.add(kav);
                }
            }
        }
        return knowledgeArticlesList;
    }
    
    
    //Assign articles to case
    @AuraEnabled
    public static boolean assignArticleToCase(List<CaseArticle> articles) {
        if(articles!=null)
        {
            upsert articles;
        }
        return true;
    }
  @AuraEnabled(cacheable=true)
    public static Knowledge__kav getKnowledgeDetails(String recordID) {
        Knowledge__kav kv= new Knowledge__kav();
        if (recordID != '' && recordID != null) {
             kv = [SELECT Title FROM Knowledge__kav where Id=:recordID];
        }
        return kv;
    }
}
