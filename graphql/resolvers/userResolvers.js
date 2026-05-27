const userResolver = {
    Query: {
        getUsers: () => {
            return [{
                userId: 1,
                firstName: "Roshan",
                lastName: "Bhatia",
                email: "roshan@gmail.com",
                username: "2kwattz",
                gender: "male",
                role: "admin",
                date_of_birth: "24th May 2002"
            }];
        }
    }
};

module.exports = userResolver;
