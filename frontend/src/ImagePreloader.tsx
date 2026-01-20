import { useEffect } from 'react';

const ImageURLs = [
  // Major Arcana
  "images/major_arcana/the_fool.jpg",
  "images/major_arcana/the_magician.jpg",
  "images/major_arcana/the_high_priestess.jpg",
  "images/major_arcana/the_empress.jpg",
  "images/major_arcana/the_emperor.jpg",
  "images/major_arcana/the_hierophant.jpg",
  "images/major_arcana/the_lovers.jpg",
  "images/major_arcana/the_chariot.jpg",
  "images/major_arcana/strength.jpg",
  "images/major_arcana/the_hermit.jpg",
  "images/major_arcana/wheel_of_fortune.jpg",
  "images/major_arcana/justice.jpg",
  "images/major_arcana/the_hanged_man.jpg",
  "images/major_arcana/death.jpg",
  "images/major_arcana/temperance.jpg",
  "images/major_arcana/the_devil.jpg",
  "images/major_arcana/the_tower.jpg",
  "images/major_arcana/the_star.jpg",
  "images/major_arcana/the_moon.jpg",
  "images/major_arcana/the_sun.jpg",
  "images/major_arcana/judgement.jpg",
  "images/major_arcana/the_world.jpg",
  // Minor Arcana - Cups
  "images/minor_arcana/cups/1_cups.jpg",
  "images/minor_arcana/cups/2_cups.jpg",
  "images/minor_arcana/cups/3_cups.jpg",
  "images/minor_arcana/cups/4_cups.jpg",
  "images/minor_arcana/cups/5_cups.jpg",
  "images/minor_arcana/cups/6_cups.jpg",
  "images/minor_arcana/cups/7_cups.jpg",
  "images/minor_arcana/cups/8_cups.jpg",
  "images/minor_arcana/cups/9_cups.jpg",
  "images/minor_arcana/cups/10_cups.jpg",
  "images/minor_arcana/cups/11_cups.jpg",
  "images/minor_arcana/cups/12_cups.jpg",
  "images/minor_arcana/cups/13_cups.jpg",
  "images/minor_arcana/cups/14_cups.jpg",
  // Minor Arcana - Pentacles
  "images/minor_arcana/pentacles/1_pentacles.jpg",
  "images/minor_arcana/pentacles/2_pentacles.jpg",
  "images/minor_arcana/pentacles/3_pentacles.jpg",
  "images/minor_arcana/pentacles/4_pentacles.jpg",
  "images/minor_arcana/pentacles/5_pentacles.jpg",
  "images/minor_arcana/pentacles/6_pentacles.jpg",
  "images/minor_arcana/pentacles/7_pentacles.jpg",
  "images/minor_arcana/pentacles/8_pentacles.jpg",
  "images/minor_arcana/pentacles/9_pentacles.jpg",
  "images/minor_arcana/pentacles/10_pentacles.jpg",
  "images/minor_arcana/pentacles/11_pentacles.jpg",
  "images/minor_arcana/pentacles/12_pentacles.jpg",
  "images/minor_arcana/pentacles/13_pentacles.jpg",
  "images/minor_arcana/pentacles/14_pentacles.jpg",
  // Minor Arcana - Swords
  "images/minor_arcana/swords/1_swords.jpg",
  "images/minor_arcana/swords/2_swords.jpg",
  "images/minor_arcana/swords/3_swords.jpg",
  "images/minor_arcana/swords/4_swords.jpg",
  "images/minor_arcana/swords/5_swords.jpg",
  "images/minor_arcana/swords/6_swords.jpg",
  "images/minor_arcana/swords/7_swords.jpg",
  "images/minor_arcana/swords/8_swords.jpg",
  "images/minor_arcana/swords/9_swords.jpg",
  "images/minor_arcana/swords/10_swords.jpg",
  "images/minor_arcana/swords/11_swords.jpg",
  "images/minor_arcana/swords/12_swords.jpg",
  "images/minor_arcana/swords/13_swords.jpg",
  "images/minor_arcana/swords/14_swords.jpg",
  // Minor Arcana - Wands
  "images/minor_arcana/wands/1_wands.jpg",
  "images/minor_arcana/wands/2_wands.jpg",
  "images/minor_arcana/wands/3_wands.jpg",
  "images/minor_arcana/wands/4_wands.jpg",
  "images/minor_arcana/wands/5_wands.jpg",
  "images/minor_arcana/wands/6_wands.jpg",
  "images/minor_arcana/wands/7_wands.jpg",
  "images/minor_arcana/wands/8_wands.jpg",
  "images/minor_arcana/wands/9_wands.jpg",
  "images/minor_arcana/wands/10_wands.jpg",
  "images/minor_arcana/wands/11_wands.jpg",
  "images/minor_arcana/wands/12_wands.jpg",
  "images/minor_arcana/wands/13_wands.jpg",
  "images/minor_arcana/wands/14_wands.jpg",
];

const ImagePreloader = ({ imageUrls }: { imageUrls: string[] }) => {
  useEffect(() => {
    imageUrls.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, [imageUrls]);

  return null; // This component doesn't render anything to the DOM
};

export { ImagePreloader, ImageURLs };
