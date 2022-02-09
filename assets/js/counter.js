

document.addEventListener('alpine:init', ()=>{

        Alpine.data('count', ()=>({
            count: 0,
            pending: false,
            hasUpdate: false,
            decrease(){
              if(this.count>0){
                  this.count--;
                  this.update();
              }  
              
            },
            increase(){
                this.count++;
                this.update();
            },
            update(){
              if(this.pending){
                  this.hasUpdate = true;
                  return;
              }
              this.pending = true;  
              direc.items("customers").createOne({
                  count: this.count
              }).then(function(){
                  if(this.hasUpdate){
                      hasUpdate = false;
                      this.pending = false;
                      this.update();
                  }
                  this.pending = false;
              }.bind(this))
            },
            doRefresh(){
                if(this.pending || !Alpine.store('login').loggedIn) return;
                this.pending = true;
                direc.items("customers").readMany({
                    sort:"-date_created",limit:1,timestam: Date.now(),
                }).then(function(d){
                    console.log(d.data.length === 0);
                    if(d.data.length === 0){
                        this.count = 0;
                    }else{
                        this.count = d.data[0].count;
                    }
                    this.hasUpdate = false;
                    this.pending = false;
                    
                }.bind(this));
            },
            init(){
                this.$nextTick(()=>{
                    onLogin = this.doRefresh.bind(this);
                });
                
            },
        }));
});