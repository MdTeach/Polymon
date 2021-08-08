// https://ipfs.io/ipfs/bafyreicsuhjalye73rtjxny35bshhzueyl5hxweanx4fz7dnuw5cdujnqy/metadata.json

const { NFTStorage, File } = require("nft.storage");
const fs = require("fs");
const { apiKey } = require("./secrect.json");
const client = new NFTStorage({ token: apiKey });

async function storeMeta(folderName, name, type) {
  const image = fs.readFileSync(`./datas/${folderName}/image.png`);
  const sprite = fs.readFileSync(`./datas/${folderName}/sprite.png`);
  const sprite_info = fs.readFileSync(`./datas/${folderName}/sprite_info.json`);
  const metadata = await client.store({
    name: name,
    description: type,
    image: new File([image], "image.png", { type: "image/png" }),
    properties: {
      sprite: new File([sprite], "sprite.png", { type: "image/png" }),
      sprite_info: new File([sprite_info], "sprite_info.json", {
        type: "text/json",
      }),
    },
  });

  console.log("IPFS URL for the metadata:", metadata.url);
  // console.log("metadata.json contents:\n", metadata.data);
  // console.log("metadata.json with IPFS gateway URLs:\n", metadata.embed());
}

// Uncommnet to add here
// storeMeta("pikaju", "Pikaju", "Electric");
// storeMeta("zapdos", "Zapdos", "Electric");
// storeMeta("blastoise", "Blastoise", "Water");
// storeMeta("feraligatr", "Feraligatr", "Water");
// storeMeta("charizard", "Charizard", "Fire");
storeMeta("typhlosion", "Typhlosion", "Fire");
// storeMeta("ivysaur", "Ivysaur", "Grass");
// storeMeta("meganium", "Meganium", "Grass");
console.log("working...");
