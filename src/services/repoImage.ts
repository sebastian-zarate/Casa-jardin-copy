'use server'


export const getImages_talleresAdmin = async () => {
    // Define the URL for the admin API endpoint
    const url = String(process.env.GITHUB_API_ADMIN_URL);
    
    try {
        // Make a GET request to the admin API endpoint
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        // Parse the response JSON data
        const data = await response.json();

        // Check if data contains a directory and access its files
        const file = data.find((file: any) => file.type === 'dir');
        const filesUrl = file._links.self;

        // Make a GET request to fetch the files in the directory
        const filesResponse = await fetch(filesUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        // Parse the response JSON data for the files
        const fileData = await filesResponse.json();
        console.log("FILEEEEE", fileData);
       
        // Filter the files and get their download URLs
        const downloadUrls = fileData.map((file: any) => file.download_url);

        // Return the download URLs as images
        return { images: downloadUrls };
    } catch (error) {
        // Return an error message if the fetch operation fails
        return { error: 'Failed to fetch data' };
    }
}

export const getImagesUser = async () => {
    const url = String(process.env.GITHUB_API_USER_URL);
    
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