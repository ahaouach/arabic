import TextBlock from "./TextBlock";
import ImageBlock from "./ImageBlock";
import AudioBlock from "./AudioBlock";
import QuizBlock from "./QuizBlock";
import NumbersBlock from "./NumbersBlock";
import QuizMatchBlock from "./QuizMatchBlock";
import GameNumbersBlock from "./GameNumbersBlock";
import PaintGame from "./PaintGame";
import InteractiveColorWorld from "./InteractiveColorWorld";
import ShapesWorld from "./ShapesWorld";
import ShapeDrawSection from "./ShapeDrawSection";
import ShapeColorSection from "./ShapeColorSection";
import LetterIntro from "./LetterIntro";
import LetterVowels from "./LetterVowels";
import LetterColoring from "./LetterColoring";
import LetterTracing from "./LetterTracing";
import LetterWordMatch from "./LetterWordMatch";
import FamilyIntro from "./FamilyIntro";
import FamilyTree from "./FamilyTree";
import FamilyMatchGame from "./FamilyMatchGame";
import HumanBodyMap from "./HumanBodyMap";
import type { Section } from "@/lib/lessonSections";

export default function SectionRenderer({ section }: { section: Section }) {
  switch (section.type) {
    case "text":
      return <TextBlock section={section.content} />;
    case "image":
      return <ImageBlock section={section.content} />;
    case "audio":
      return <AudioBlock section={section.content} />;
    case "quiz":
      return <QuizBlock section={section.content} />;
    case "numbers":
      return <NumbersBlock section={section.content} />;
    case "quiz_match":
      return <QuizMatchBlock section={section.content} />;
    case "game_numbers":
      return <GameNumbersBlock section={section.content} />;
    case "paint_game":
      return <PaintGame section={section.content} />;
    case "interactive_color_world":
      return <InteractiveColorWorld section={section.content} />;
    case "interactive_shapes_world":
      return <ShapesWorld section={section.content} />;
    case "draw_shapes":
      return <ShapeDrawSection section={section.content} />;
    case "color_shapes":
      return <ShapeColorSection section={section.content} />;
    case "letter_intro":
      return <LetterIntro section={section.content} />;
    case "letter_vowels":
      return <LetterVowels section={section.content} />;
    case "letter_coloring":
      return <LetterColoring section={section.content} />;
    case "letter_tracing":
      return <LetterTracing section={section.content} />;
    case "letter_word_match":
      return <LetterWordMatch section={section.content} />;
    case "family_intro":
      return <FamilyIntro section={section.content} />;
    case "family_tree":
      return <FamilyTree section={section.content} />;
    case "family_match":
      return <FamilyMatchGame section={section.content} />;
    case "body_map":
      return <HumanBodyMap section={section.content} />;
    default:
      return null;
  }
}
