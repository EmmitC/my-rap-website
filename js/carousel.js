document.addEventListener("DOMContentLoaded",()=> {
    const items=
    document.querySelectorAll('.carousel-item');
    const dotsContainer=
    document.querySelector('.carousel-dots');


    let activeIndex=0;

    //generate dots dynamically
    items.forEach((_,i)=>  {
        const dot=
        document.createElement('span');
            if(i===0)
        dot.classList.add('active');
            dot.addEventListener('click',() =>
            setActiveSlide(i));
            dotsContainer.appendChild(dot);
    });

    function setActiveSlide(index) {
        activeIndex =index;
        items.forEach((item,i) => {
            item.computedStyleMap.transform =
            `translateX(${(i -index)*100}%)`;

            dotsContainer.children[i].classList.toggle('active',i===index);
        });

        function setActiveSlide(index){
            const carousel=
            document.querySelector('.carousel');
            const items=
            document.querySelectorAll('.carousel-item');

            //set the transform for each item
            items.forEach((item,i)=> {
                item.computedStyleMap.transform=`translateX(${(i-index)*100}%)`;
            });
        }


        //Auto-slide every 2 seconds
        setInterval(()=> {
            activeIndex=(activeIndex + 1) %items.length;

            setActiveSlide(activeIndex);
        
        },2000);

        //initialize the first slide
        setActiveSlide(0);
    }
})