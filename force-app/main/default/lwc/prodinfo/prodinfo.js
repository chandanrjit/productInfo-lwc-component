import { LightningElement, track,api,wire} from 'lwc';
import KnowledgeDetails from '@salesforce/apex/knowledgeSearchController.getKnowledgeDetails';

export default class Prodinfo extends LightningElement {
    @track data ={};
    @api recordId;
    @track currenRecordId;
    @track prodtitle;
    isRenderCallbackActionExecuted = false;
   
    // Call the third party API to get the project details based on attributes i.e SKU Number or tilte etc
    getProductData() {
        const calloutURI = 'https://fakestoreapi.com/products';
         fetch(calloutURI, {
             method: "GET"
         }).then((response) => response.json())
             .then(product => {
                 console.log(product)
                 product = product.filter(a=> a.title == this.prodtitle); 
                 console.log(product)
              
                 this.data ={  
                     id : product[0].id,
                     title : product[0].title,
                     price : product[0].price,
                     description : product[0].description,
                     category : product[0].category,
                     image: product[0].image
                }
             });
    }
    // On reder of the component call the API
    renderedCallback() {
        if (this.isRenderCallbackActionExecuted)
        {
            return;
        }

        this.isRenderCallbackActionExecuted = true;
        
        this.currenRecordId = this.recordId;        
        //console.log(this.currenRecordId);
        
        // Call Apex
        KnowledgeDetails({recordID: this.currenRecordId})
        .then((data,error) => {
            if (data) {
                this.error = undefined;
                //console.log(data,'-----check----')
                this.prodtitle = data.Title;
               
            } else if (error) {
                this.error = error;
                console.log('Error:'+ JSON.stringify(error));
                
            }
        });
        this.getProductData(this.prodtitle);

    }
    
}