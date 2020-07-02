// essa função foi criada para simplificar o uso de document.querySelector o tempo todo
//sendo assim , o inves de usarmos document.querySelector('algumacoisa')
// iremos usar c('algumacoisa') 
//el = elemento   
const c = (el) => document.querySelector(el) ;

const cs = (el) => document.querySelectorAll(el);

let  modalQt = 1; //quantidade do modal ao abrir

let cart = []; // array onde adicionamos os itens do carrinho.

let modalKey = 0; // criado para saber qual pizza estamos adicionando no carrinho. Criamos let fora para poder utilizar em todas as funções que quisermos.



// Listagem das pizzas
pizzaJson.map((item, index) => { //função .map executa os comandos abaixo para cada item dentro do objeto pizzaJson
    //adicionando modelos de pizza 

    //true para pegar tudo que tiver dentro do item
    let pizzaItem = c('.models .pizza-item').cloneNode(true); 
    
    pizzaItem.setAttribute('data-key', index); // inserindo o atributo 'data-key' com o valor 'index' em casa div criada, sendo assim, cada div será uma key unica. 
    //Essa linha de código foi criada para sabermos em qual pizza estamos clicando, se é na pizza : 0 ou 1 ou 2..... ou 6

    //adicionando imagem de cada pizza
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    //adicionando preço 
    pizzaItem.querySelector('.pizza-item--price').innerHTML = 'R$ ' + item.price[2].toFixed(2); //formatando p 2 algarismos depois da virgula
    //adicionando nome da pizza
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    //adicionando descrição da pizza
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    
    //adicionando evento de click na tag a 
    pizzaItem.querySelector('a').addEventListener('click',(e)=>{
        modalQt = 1;  // quando abrir o modal , setar o valor em modalQt
        e.preventDefault(); //nao atualiza a pagina ao clicar
        let key = e.target.closest('.pizza-item').getAttribute('data-key'); //closest pega a tag 'pizza-item' mais proxima da tag 'a' que estamos modificando
        modalKey = key;
        

        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--actualPrice').innerHTML ='R$ '+ pizzaJson[key].price;
        
        //tirando a seleção do ''GRANDE''
        c('.pizzaInfo--size.selected').classList.remove('selected');

        cs('.pizzaInfo--size').forEach((size,sizeIndex) => { // os parametros passados podem ser chamados de qualquer outro nome 
           if (sizeIndex == 2){
               size.classList.add('selected');
               c('.pizzaInfo--actualPrice').innerHTML = 'R$ '+pizzaJson[key].price[sizeIndex];
           }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });

        c('.pizzaInfo--qt').innerHTML = modalQt;

        c('.pizzaWindowArea').style.opacity = 0;
        c('.pizzaWindowArea').style.display = 'flex';
        setTimeout(() => {
            c('.pizzaWindowArea').style.opacity = 1;    
        }, 200);  
    });

        // append adiciona um conteudo ao invés de substitui-lo por outro 
        c('.pizza-area').append(pizzaItem);
});

// Eventos do Modal
function closeModal() {
    c('.pizzaWindowArea').style.opacity = 0; //tem o transiction no css que irá demorar meio segundo para virar de opacity 1 para opacity 0 
    setTimeout(() => {      
        c('.pizzaWindowArea').style.display = 'none'; //juntamente com os 0,5 segundos do transiction, é setato 500ms para o modal sumir setando-o como display none
    },500);
}

cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click',closeModal);
});

c('.pizzaInfo--qtmenos').addEventListener('click', () => {    
    if (modalQt > 1){
        modalQt--;
        c('.pizzaInfo--qt').innerHTML = modalQt;
    }
});

c('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;
});

cs('.pizzaInfo--size').forEach((size,sizeIndex) => {
    size.addEventListener('click' , () => {
        c('.pizzaInfo--size.selected').classList.remove('selected');
        c('.pizzaInfo--actualPrice').innerHTML = 'R$ '+pizzaJson[modalKey].price[sizeIndex].toFixed(2);
        size.classList.add('selected');

    });
});

c('.pizzaInfo--addButton').addEventListener('click', () => {
    // ↓ qual a pizza? 
    // modalKey;

    // qual o tamanho? 
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));
    
    // ↓ quantas pizzas? 
    // modalQt;

    // juntando o ID da pizza e o tamanho dela para verificar se a pizza adicionada ja tinha sido adicionada anteriormente
    let identifier = pizzaJson[modalKey].id+'@'+size;

    // verificando se o item existe no carrinho
    let key = cart.findIndex((item) =>{  // recebe e verifica item, que significa cada item do carrinho.
        return item.identifier == identifier; // VERIFICAÇÃO dos identifiers do carrinho, qual é que tem o mesmo identifier do meu, se achar, retornará o index dele, se não achar, retorna -1  
    });
    
    if (key > -1){ // a mesma pizza já existe no carrinho
         cart[key].qt += modalQt // somente adiciona a quantidade 
    } else {
        cart.push({
        identifier,
        id:pizzaJson[modalKey].id,
        size,
        qt:modalQt
        });
    }
    updateCart(size);
    closeModal();
});

c('.menu-openner').addEventListener('click', () => {
    if (cart.length > 0 ){
        c('aside').style.left = '0';
    }
});

c('.menu-closer').addEventListener('click', () => {
    c('aside').style.left = '100vw'
});

function updateCart(SzId){
    // console.log(SzId);
    c('.menu-openner span').innerHTML = cart.length;

    if(cart.length > 0){
        c('aside').classList.add('show');
        c('.cart').innerHTML = '';

        let subtotal  = 0;
        let desconto = 0;
        let total = 0;


        for(let i in cart) {
            let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id); //se o item(em pizza Json) .id for igual ao cart[i].id, retorne o item que está em Json completo
            subtotal += pizzaItem.price[SzId] * cart[i].qt;

            let cartItem = c('.models .cart--item').cloneNode(true);
            
            let pizzaSizeName;
            switch(cart[i].size){
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;
            }
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
           
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if(cart[i].qt > 1){
                    cart[i].qt--;
                } else {
                    cart.splice(i,1);
                }
                updateCart(SzId);
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qt++;
                updateCart(SzId); //re-atuliza carrinho para mudar a quantidade 
            });

            c('.cart').append(cartItem);
        } 

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    } else {
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }
}
 
