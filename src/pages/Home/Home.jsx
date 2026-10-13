import App_Footer from "../../components/Footer";
import App_Navbar from "../../components/Navbar";

import homeStyle from  "./Home.module.css";

function Home(){


    return(
        <>  
            <App_Navbar/>
            <main className={`container ${homeStyle.homepage}`}>
                <div>
                    <h1 className={`${homeStyle.title}`}>welcom to my home</h1>

                </div>
            </main>
            <App_Footer/>
        </>
    )
};

export default Home;