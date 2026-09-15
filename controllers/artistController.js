const Artist = require('../models/Artist');
const { uploadBufferToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryUpload');

// There is always exactly one Artist document. This helper fetches it,
// creating a default one on first access.
const getOrCreateArtist = async () => {
  let artist = await Artist.findOne();
  if (!artist) artist = await Artist.create({});
  return artist;
};

// @desc  Get artist profile
// @route GET /api/artist
// @access Public
const getArtist = async (req, res) => {
  const artist = await getOrCreateArtist();
  res.json({ success: true, data: artist });
};

// @desc  Update artist profile (image optional)
// @route PUT /api/artist
// @access Private (admin only)
const updateArtist = async (req, res) => {
  const artist = await getOrCreateArtist();
  const { name, bio, quote, experience, specialization } = req.body;

  if (req.file) {
    const { url, publicId } = await uploadBufferToCloudinary(req.file.buffer, 'stuart-photography/artist');
    if (artist.cloudinaryPublicId) await deleteFromCloudinary(artist.cloudinaryPublicId);
    artist.imageUrl = url;
    artist.cloudinaryPublicId = publicId;
  }

  if (name !== undefined) artist.name = name;
  if (bio !== undefined) artist.bio = bio;
  if (quote !== undefined) artist.quote = quote;
  if (experience !== undefined) artist.experience = experience;
  if (specialization !== undefined) artist.specialization = specialization;

  await artist.save();
  res.json({ success: true, data: artist });
};

module.exports = { getArtist, updateArtist };
