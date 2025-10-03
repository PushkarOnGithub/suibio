module suibio::suibio {
    use sui::tx_context::{Self, TxContext};
    use sui::object::{Self, UID};
    use sui::transfer;
    use std::string::{Self, String};
    use sui::package;
    use sui::display;

    /// The OTW for the package
    struct SUIBIO has drop {}

    /// The Profile object
    struct Profile has key, store {
        id: UID,
        name: String,
        bio: String,
        links: vector<String>,
        owner: address,
    }

    /// Events
    struct ProfileCreated has copy, drop {
        id: object::ID,
        owner: address,
    }

    /// Initialize the package
    fun init(otw: SUIBIO, ctx: &mut TxContext) {
        let publisher = package::claim(otw, ctx);

        let keys = vector[
            string::utf8(b"name"),
            string::utf8(b"description"),
            string::utf8(b"image_url"),
            string::utf8(b"project_url"),
            string::utf8(b"link"),
        ];

        let values = vector[
            string::utf8(b"{name}"),
            string::utf8(b"{bio}"),
            string::utf8(b"https://api.dicebear.com/7.x/identicon/svg?seed={name}"), // Placeholder avatar
            string::utf8(b"https://suibio.com/{id}"),
            string::utf8(b"https://suibio.com/{id}"),
        ];

        let display = display::new_with_fields<Profile>(
            &publisher, keys, values, ctx
        );
        display::update_version(&mut display);

        transfer::public_transfer(publisher, tx_context::sender(ctx));
        transfer::public_transfer(display, tx_context::sender(ctx));
    }

    /// Create a new profile
    public entry fun create_profile(
        name: vector<u8>,
        bio: vector<u8>,
        links: vector<vector<u8>>,
        ctx: &mut TxContext
    ) {
        let owner = tx_context::sender(ctx);
        let id = object::new(ctx);
        
        let profile = Profile {
            id,
            name: string::utf8(name),
            bio: string::utf8(bio),
            links: vector_to_string_vector(links),
            owner,
        };

        sui::event::emit(ProfileCreated {
            id: object::uid_to_inner(&profile.id),
            owner,
        });

        transfer::transfer(profile, owner);
    }

    /// Update profile bio
    public entry fun update_bio(
        profile: &mut Profile,
        new_bio: vector<u8>,
        ctx: &mut TxContext
    ) {
        assert!(profile.owner == tx_context::sender(ctx), 0);
        profile.bio = string::utf8(new_bio);
    }

    /// Update profile links
    public entry fun update_links(
        profile: &mut Profile,
        new_links: vector<vector<u8>>,
        ctx: &mut TxContext
    ) {
        assert!(profile.owner == tx_context::sender(ctx), 0);
        profile.links = vector_to_string_vector(new_links);
    }

    /// Internal helper to convert vector<vector<u8>> to vector<String>
    fun vector_to_string_vector(vec: vector<vector<u8>>): vector<String> {
        let mut res = vector::empty<String>();
        let mut i = 0;
        let len = vector::length(&vec);
        while (i < len) {
            vector::push_back(&mut res, string::utf8(*vector::borrow(&vec, i)));
            i = i + 1;
        };
        res
    }
}
