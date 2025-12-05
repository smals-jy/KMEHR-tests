---
sidebar_position: 1
---

# Introduction

## Project Background

This project originally began as an thinking within the VIDIS project, a key part of RIZIV's (National Institute for Health and Disability Insurance) ongoing efforts to improve eHealth services in Belgium. The VIDIS project, detailed [here](https://www.inami.fgov.be/fr/themes/esante/vidis-partager-les-donnees-sur-les-medicaments-de-facon-electronique), aims to facilitate the electronic sharing of medication data, ensuring more efficient and secure healthcare services.

During the development of VIDIS, it became evident that there was a critical need for more up-to-date and configurable testing mechanisms. This was especially important for ensuring that our frontend applications could reliably handle the nuances of the KMEHR format, which is known for its complexity and potential to cause subtle issues if not rigorously tested.

The specific needs that drove the creation of this project included:

- **Up-to-date and configurable tests:** Ensuring that the tests could easily be modified and updated to reflect the latest requirements and data structures.
- **Regression tests in our frontends:** To catch any inadvertent issues introduced during updates or changes, particularly given the "sneaky" nature of the KMEHR format.
- **Generation of MS KMEHR XML files based on JSON/TS configuration files:** Automating the creation of KMEHR XML files from configurable JSON or TypeScript files to streamline the development process.
- **Validation of KMEHR outputs:** Verifying that the generated KMEHR files are valid according to the official specifications.
- **Validation of MS files:** Ensuring the generated files conform to MS standards, with additional validation using Vitalink's Schematron rules.
- **Generation of PCDH (FarmaFlux) XML files:** Creating PCDH XML files, which are essential for FarmaFlux integrations.
- **...**

These requirements highlighted the importance of a dedicated testing framework that could evolve regardless of the software used, leading to the development of this standalone project. It is thus not enforced or validated by any party mentionned above.

## Sources of inspiration

- [IMEC](https://wiki.ivlab.ilabt.imec.be/display/VLMS/EVS_Scenarios) tests, which have not been maintained since 2020
- [RAMIT](https://ramit.be/vidis-virtual-integrated-drug-information-system/) , who took the lead after but didn't publish anything at this date
- ....
