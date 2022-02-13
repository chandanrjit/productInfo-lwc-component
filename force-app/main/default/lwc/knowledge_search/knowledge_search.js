import { LightningElement, track, wire, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import KnowledgeArticles from '@salesforce/apex/knowledgeSearchController.getKnowledgeArticles';
import assignArticleToCase from '@salesforce/apex/knowledgeSearchController.assignArticleToCase';
import {ShowToastEvent} from 'lightning/platformShowToastEvent'; // import toast message event .
import './knowledge_search.css';
const columns = [
    {label: 'Title', fieldName: 'url', type: 'url',sortable : true,typeAttributes: {label: { fieldName: 'Title' }, target: '_self'}},
    { label: 'Question', fieldName: 'Question__c', type: 'text' },
    { label: 'Created Date', fieldName: 'CreatedDate', type: 'date' },
    { label: 'Associated Cases', fieldName: 'ArticleCaseAttachCount', type: 'text' },
    { label: 'Total View', fieldName: 'ArticleTotalViewCount', type: 'text' },
];
export default class Knowledge_search extends NavigationMixin(LightningElement)  {

    @track article;  
    @track results;
    @track data = [];
    columns = columns;
    @api recordId;
    @track recordSelected=false;
    caseId;
    error;
    
    connectedCallback()
    {
        this.caseId=this.recordId;
    }

    @wire(KnowledgeArticles, {searchText : '$article'})
    wiredArticles({error, data}) {
        if (data) {
            this.articles = [];
            for (let article of data) {
                let myArticle = {};
                console.log('article:' + JSON.stringify(article));
                this.KnowledgePageRef = {
                    type: "standard__recordPage",
                    attributes: {
                        "recordId": article.Id,
                        "objectApiName": "Knowledge__kav",
                        "actionName": "view"
                    }
                };

                this[NavigationMixin.GenerateUrl](this.KnowledgePageRef)
                    .then(articleUrl => {
                        myArticle = {...article};
                        myArticle.url = articleUrl;
                        this.data = [...this.data, myArticle];
                    });
            }
            this.error = undefined;
        }
        if (error) {
            this.error = error;
            this.data = undefined;
        }
    }

    changeHandler(event) {
        this.article = event.target.value;
        console.log('article', this.article);
    }
    assignFaqToCase = event => {
        var el = this.template.querySelector('lightning-datatable');
        var selectedRows = el.getSelectedRows();
        var caseArticles=[];
        for (let i = 0; i < selectedRows.length; i++){
            var caseArticle={
                "CaseId":this.caseId,
                "KnowledgeArticleId":selectedRows[i].KnowledgeArticleId
            };
            caseArticles.push(caseArticle);
        }

        assignArticleToCase({articles: caseArticles})
        .then((data,error) => {
            if (data) {
                this.error = undefined;
                this.dispatchEvent(
                    new ShowToastEvent({
                        message: 'Case Associated Successfully',
                        variant: 'success',
                    }),
                );
            } else if (error) {
                this.error = error;
                console.log('Error:'+ JSON.stringify(error));
                this.dispatchEvent(
                new ShowToastEvent({
                    message: 'Error in Case Assiciation:' + error,
                    variant: 'error'
                }), );
            }
        });

    }
    handleRowSelection = event => {
        var selectedRows=event.detail.selectedRows;
        this.recordSelected=false;
        if(selectedRows.length>0)
        {  
            this.recordSelected=true;
        }
    }
    handleCancel= event => {
        this.recordSelected=false;
    }
}