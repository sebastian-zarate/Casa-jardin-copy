'use server'


export const getImages = async () => {
    const url = String(process.env.GITHUB_API_URL);
    
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        //console.log(data)
        const downloadurls = data.map((image: any) => image.download_url);
        return { images: downloadurls};
    } catch (error) {
        return { error: 'Failed to fetch data' };
    }
}