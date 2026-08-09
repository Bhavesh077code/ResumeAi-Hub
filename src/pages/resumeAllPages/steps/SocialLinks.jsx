import React from "react";

const SocialLinks = ({
  form,
  handleLinksChange,
}) => {
  return (
    <div>

      <h2 className="text-2xl font-bold mb-8">
        Social Links
      </h2>

      <div className="grid md:grid-cols-2 gap-4">

        <input
          name="github"
          placeholder="Github"
          value={form.links[0].github}
          onChange={(e) => handleLinksChange(0, e)}
          className="input"
        />

        <input
          name="linkedin"
          placeholder="LinkedIn"
          value={form.links[0].linkedin}
          onChange={(e) => handleLinksChange(0, e)}
          className="input"
        />

        <input
          name="portfolio"
          placeholder="Portfolio"
          value={form.links[0].portfolio}
          onChange={(e) => handleLinksChange(0, e)}
          className="input"
        />

        <input
          name="twitter"
          placeholder="Twitter"
          value={form.links[0].twitter}
          onChange={(e) => handleLinksChange(0, e)}
          className="input"
        />

        <input
          name="website"
          placeholder="Website"
          value={form.links[0].website}
          onChange={(e) => handleLinksChange(0, e)}
          className="input"
        />

      </div>

    </div>
  );
};

export default SocialLinks;