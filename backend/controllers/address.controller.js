import Address from "../models/address.model.js";
import User from "../models/user.model.js";

// Add a new address
export const addAddress = async (req, res) => {
    try {
        const { userId } = req.user; // Assume user ID is attached to request after authentication
        const { addressLine1, addressLine2, city, state, country, postalCode, phone, isPrimary } = req.body;

        const newAddress = new Address({
            user: userId,
            addressLine1,
            addressLine2,
            city,
            state,
            country,
            postalCode,
            phone,
            isPrimary: isPrimary || false, // Default is false
        });

        await newAddress.save();

        // If this address is marked as primary, update the user's other addresses
        if (isPrimary) {
            await Address.updateMany({ user: userId, _id: { $ne: newAddress._id } }, { $set: { isPrimary: false } });
        }

        res.status(201).json(newAddress);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get all addresses for a user
export const getAddresses = async (req, res) => {
    try {
        const { userId } = req.user; // Assume user ID is attached to request after authentication

        const addresses = await Address.find({ user: userId });

        if (!addresses.length) {
            return res.status(404).json({ error: "No addresses found" });
        }

        res.json(addresses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Update an address
export const updateAddress = async (req, res) => {
    try {
        const { addressId } = req.params;
        const { addressLine1, addressLine2, city, state, country, postalCode, phone, isPrimary } = req.body;

        const address = await Address.findById(addressId);

        if (!address) {
            return res.status(404).json({ error: "Address not found" });
        }

        // If the address is marked as primary, ensure no other address is primary
        if (isPrimary) {
            await Address.updateMany({ user: address.user, _id: { $ne: address._id } }, { $set: { isPrimary: false } });
        }

        address.addressLine1 = addressLine1 || address.addressLine1;
        address.addressLine2 = addressLine2 || address.addressLine2;
        address.city = city || address.city;
        address.state = state || address.state;
        address.country = country || address.country;
        address.postalCode = postalCode || address.postalCode;
        address.phone = phone || address.phone;
        address.isPrimary = isPrimary !== undefined ? isPrimary : address.isPrimary;

        await address.save();

        res.json(address);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Delete an address
export const deleteAddress = async (req, res) => {
    try {
        const { addressId } = req.params;

        const address = await Address.findById(addressId);

        if (!address) {
            return res.status(404).json({ error: "Address not found" });
        }

        // Optionally handle deleting a primary address (e.g., set another address as primary)
        if (address.isPrimary) {
            const newPrimaryAddress = await Address.findOne({ user: address.user, _id: { $ne: address._id } });
            if (newPrimaryAddress) {
                newPrimaryAddress.isPrimary = true;
                await newPrimaryAddress.save();
            }
        }

        await address.remove();
        res.json({ message: "Address deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};
