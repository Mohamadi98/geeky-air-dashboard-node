const permissions_handler = (websites, websites_posts) => {
    const updatedPosts = [...websites_posts];

    for (const website of websites) {
        if (!website.website_value) {
            const matchingPostIndex = updatedPosts.findIndex(post => post.website_name === website.website_name);
            if (matchingPostIndex !== -1) {
                updatedPosts[matchingPostIndex].website_value = false;
            }
        }
    }

  return updatedPosts;
}

module.exports = {
    permissions_handler: permissions_handler
}