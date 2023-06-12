import Header from "./components/Header"
import SearchSideBar from "./components/SearchSideBar"
import RestaurantCard from "./components/RestaurantCard"
import { PrismaClient } from "@prisma/client"
import { PRICE } from "@prisma/client"


const prisma = new PrismaClient()

interface SearchParams {
    city?: string, cuisine?: string, price?: PRICE
}

const fetchRestaurantByCity = async (searchParams: SearchParams) => {
    //console.log(searchParams)
    const where: any = {}

    if(searchParams.city) {
        const location = {
            name: {
                equals: searchParams.city.toLowerCase()
            }
        }
        where.location = location
    }

    if(searchParams.cuisine) {
        const cuisine = {
            name: {
                equals: searchParams.cuisine.toLowerCase()
            }
        }
        where.cuisine = cuisine
    }

    if(searchParams.price) {
        const price = {            
            equals: searchParams.price            
        }
        where.price = price
    }

    const select = {
        id: true,
        name: true,
        main_image: true,
        price: true,
        cuisine: true,
        location: true,
        slug: true,
        reviews: true
    }

    return prisma.restaurant.findMany({
        where,
        select
    })    
}

const fetchLocations = async () => {
    return prisma.location.findMany()
}

const fetchCuisines = async () => {
    return prisma.cuisine.findMany()
}

const Search = async ({ searchParams }:{searchParams:SearchParams}) => {
    //console.log(props) pass param as props: any and see result on terminal

    const restaurants = await fetchRestaurantByCity(searchParams)
    //console.log({restaurants})
    const locations = await fetchLocations()
    const cuisines = await fetchCuisines()
    return (
        <>
            <Header />
            <div className="flex py-4 m-auto w-2/3 justify-between items-start">
                <SearchSideBar
                    locations={locations}
                    cuisines={cuisines}
                    searchParams={searchParams}
                />
                <div className="w-5/6">
                    {restaurants.length ? (
                        <>
                            {restaurants.map((restaurant) => (
                                <RestaurantCard
                                    key={restaurant.id}
                                    restaurant={restaurant}
                                />
                            ))}
                        </>
                    ) : (
                        <p>Sorry,no restaurants found in this area</p>
                    )}

                </div>
            </div>
        </>

    )
}

export default Search