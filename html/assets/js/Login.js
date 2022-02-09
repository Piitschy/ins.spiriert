var animation = null;
function toggleDialog(){
    console.log("toggle");
   animation == null||animation.remove("#loginDialog");
   animation = anime({
        targets: ["#loginDialog"],
        translateY: Alpine.store('login').dialog?-500:0,
        opacity: Alpine.store('login').dialog?0:1,
        duration: 600,
        easing: "easeOutQuad"
    });
    Alpine.store('login').dialog  =!  Alpine.store('login').dialog;
}

document.addEventListener('alpine:init', ()=>{

        Alpine.data('login', ()=>({
            email: "", 
            password: "",
            loading: false,
            fpw: false, 
            fmail: false,
            logout(){
                direc.auth.logout().then(()=>{
                     Alpine.store('login').loggedIn = false;
                     Alpine.store('login').user = null;
                });
            },
            login(){
                this.loading = true;
                console.log(this.email);
                direc.auth.login({email:this.email,password:this.password}).then(()=>{
                    Alpine.store('login').loggedIn = true;
                    this.loading = false;
                    onLogin();
                });
            }
        }));

        Alpine.store('login', {
            user: Alpine.$persist([]).as("login_user"),
            loggedIn: Alpine.$persist(false),
            dialog: false,
        });
    
    });
document.addEventListener('alpine:initialized', ()=>{
    Alpine.store('login').dialog = !Alpine.store('login').loggedIn;
});