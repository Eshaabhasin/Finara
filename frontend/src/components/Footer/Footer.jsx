import { Link } from "react-router-dom"
const Footer = () => {
    return(
        <>
        <footer class="relative lg:mt-0 mt-[70vh] rounded-lg w-[97vw] shadow bottom-0 bg-zinc-800/40 m-4 ">
            <div class="w-full max-w-screen-xl mx-auto p-4 md:py-8">
                <div class="sm:flex sm:items-center sm:justify-between">
                    <a href="" class="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
                       
                        <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Finara</span>
                    </a>
                        <ul class="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
                        <li>
                       <Link to='/'><a href="#" class="hover:underline me-4 md:me-6">Home</a></Link>
                        </li>
                        <li>
                           <Link to='/Spendly'> <a href="#" class="hover:underline me-4 md:me-6">Spendly</a></Link>
                        </li>
                        <li>
                            <Link to='Investimate'><a href="#" class="hover:underline me-4 md:me-6">Investimate</a></Link>
                        </li>
                        <li>
                           <Link to='/SamvaadAI'> <a href="#" class="hover:underline me-4 md:me-6">Samvaad AI</a></Link>
                        </li>
                        <li>
                            <Link to='/LearningPath'><a href="#" class="hover:underline me-4 md:me-6">Learn</a></Link>
                        </li>
                        <li>
                           <Link to='/Video'><a href="#" class="hover:underline me-4 md:me-6">Community</a></Link> 
                        </li>
                        <li>
                           <Link to='/Tutorial'><a href="#" class="hover:underline me-4 md:me-6">Tutorial</a></Link> 
                        </li>
                        <li>
                           <Link to='/Forums'><a href="#" class="hover:underline me-4 md:me-6">Forums</a></Link> 
                        </li>
                        </ul>
                </div>
                <hr class="my-6 border-gray-200/10 sm:mx-auto dark:border-gray-700 lg:my-8" />
                <span class="block text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2024 <a href="" class="hover:underline">MoneyMitra™</a>. All Rights Reserved.</span>
            </div>
        </footer>
        </>
    )
}

export default Footer